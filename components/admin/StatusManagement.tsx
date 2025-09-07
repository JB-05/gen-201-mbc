'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Shield, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface TeamForReview {
  id: string;
  team_name: string;
  school_name: string;
  school_district: string;
  lead_email: string;
  registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified';
  created_at: string;
  team_members_count: number;
}

interface StatusUpdateLog {
  id: string;
  team_name: string;
  old_status: string;
  new_status: string;
  comment: string | null;
  admin_name: string;
  created_at: string;
}

interface StatusManagementProps {
  onStatsChange: () => void;
}

export function StatusManagement({ onStatsChange }: StatusManagementProps) {
  const [pendingTeams, setPendingTeams] = useState<TeamForReview[]>([]);
  const [statusLogs, setStatusLogs] = useState<StatusUpdateLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  useEffect(() => {
    loadTeamsForReview();
    loadStatusLogs();
  }, [filterStatus]);

  const loadTeamsForReview = async () => {
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          id,
          team_name,
          school_name,
          school_district,
          lead_email,
          registration_status,
          created_at,
          team_members (id)
        `)
        .eq('registration_status', filterStatus)
        .order('created_at', { ascending: true }) as {
          data: Array<{
            id: string;
            team_name: string;
            school_name: string;
            school_district: string;
            lead_email: string;
            registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified';
            created_at: string;
            team_members?: Array<{ id: string }>;
          }> | null;
          error: any;
        };

      if (error) throw error;

      const teamsWithCount = teams?.map(team => ({
        id: team.id,
        team_name: team.team_name,
        school_name: team.school_name,
        school_district: team.school_district,
        lead_email: team.lead_email,
        registration_status: team.registration_status,
        created_at: team.created_at,
        team_members_count: team.team_members?.length || 0
      })) || [];

      setPendingTeams(teamsWithCount);
    } catch (error) {
      console.error('Error loading teams for review:', error);
      toast.error('Failed to load teams for review');
    }
  };

  const loadStatusLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('team_status_logs')
        .select(`
          id,
          old_status,
          new_status,
          comment,
          created_at,
          teams (team_name),
          admins (name)
        `)
        .order('created_at', { ascending: false })
        .limit(20) as {
          data: Array<{
            id: string;
            old_status: string | null;
            new_status: string;
            comment: string | null;
            created_at: string;
            teams: { team_name: string } | null;
            admins: { name: string } | null;
          }> | null;
          error: any;
        };

      if (error) throw error;

      const formattedLogs = logs?.map(log => ({
        id: log.id,
        team_name: log.teams?.team_name || 'Unknown Team',
        old_status: log.old_status || '',
        new_status: log.new_status,
        comment: log.comment,
        admin_name: log.admins?.name || 'Unknown Admin',
        created_at: log.created_at
      })) || [];

      setStatusLogs(formattedLogs);
    } catch (error) {
      console.error('Error loading status logs:', error);
      // Don't show error toast for logs as it's not critical
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStatus = async (teamId: string, newStatus: string, comment?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('teams')
        .update({ registration_status: newStatus })
        .eq('id', teamId);

      if (error) throw error;

      // Log the status change with comment if provided
      if (comment) {
        await (supabase as any)
          .from('team_status_logs')
          .update({ comment })
          .eq('team_id', teamId)
          .order('created_at', { ascending: false })
          .limit(1);
      }

      await loadTeamsForReview();
      await loadStatusLogs();
      onStatsChange();
      toast.success('Team status updated successfully');
    } catch (error) {
      console.error('Error updating team status:', error);
      toast.error('Failed to update team status');
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedTeams.length === 0 || !bulkAction) {
      toast.error('Please select teams and an action');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('teams')
        .update({ registration_status: bulkAction })
        .in('id', selectedTeams);

      if (error) throw error;

      // Log bulk changes with comment
      if (comment) {
        const logPromises = selectedTeams.map(teamId =>
          (supabase as any)
            .from('team_status_logs')
            .insert({
              team_id: teamId,
              old_status: filterStatus,
              new_status: bulkAction,
              comment: `Bulk update: ${comment}`
            })
        );
        
        await Promise.all(logPromises);
      }

      setSelectedTeams([]);
      setBulkAction('');
      setComment('');
      await loadTeamsForReview();
      await loadStatusLogs();
      onStatsChange();
      toast.success(`${selectedTeams.length} teams updated successfully`);
    } catch (error) {
      console.error('Error bulk updating teams:', error);
      toast.error('Failed to update teams');
    }
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const selectAllTeams = () => {
    if (selectedTeams.length === pendingTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(pendingTeams.map(team => team.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'verified': return <Shield className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'verified': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-[#928dab]">Loading status management...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Bulk Status Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-black/50 border-[#7303c0] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black border-[#7303c0]">
                <SelectItem value="pending">Pending Teams</SelectItem>
                <SelectItem value="shortlisted">Shortlisted Teams</SelectItem>
                <SelectItem value="rejected">Rejected Teams</SelectItem>
                <SelectItem value="verified">Verified Teams</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48 bg-black/50 border-[#7303c0] text-white">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent className="bg-black border-[#7303c0]">
                <SelectItem value="shortlisted">Shortlist</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
                <SelectItem value="verified">Verify</SelectItem>
                <SelectItem value="pending">Mark Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleBulkStatusUpdate}
              disabled={selectedTeams.length === 0 || !bulkAction}
              className="bg-[#7303c0] hover:bg-[#928dab] text-white"
            >
              Update {selectedTeams.length} Teams
            </Button>
          </div>

          <Textarea
            placeholder="Add comment for status change (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-black/50 border-[#7303c0] text-white"
          />
        </CardContent>
      </Card>

      {/* Teams List */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Teams ({pendingTeams.length})
            </CardTitle>
            <Button
              onClick={selectAllTeams}
              variant="outline"
              className="border-[#7303c0] text-[#7303c0] hover:bg-[#7303c0] hover:text-white"
            >
              {selectedTeams.length === pendingTeams.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTeams.map((team) => (
              <div
                key={team.id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedTeams.includes(team.id)
                    ? 'bg-[#7303c0]/20 border-[#7303c0]'
                    : 'bg-black/20 border-[#7303c0]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.id)}
                      onChange={() => toggleTeamSelection(team.id)}
                      className="w-4 h-4 rounded border-[#7303c0] bg-black/50"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{team.team_name}</h3>
                      <p className="text-sm text-[#928dab]">
                        {team.school_name} • {team.school_district}
                      </p>
                      <p className="text-xs text-[#928dab]">
                        {team.team_members_count} members • {team.lead_email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(team.registration_status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(team.registration_status)}
                      {team.registration_status}
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => updateTeamStatus(team.id, 'shortlisted')}
                        className="bg-green-500 hover:bg-green-600 text-white h-8 px-2"
                        disabled={team.registration_status === 'shortlisted'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateTeamStatus(team.id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white h-8 px-2"
                        disabled={team.registration_status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateTeamStatus(team.id, 'verified')}
                        className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-2"
                        disabled={team.registration_status === 'verified'}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pendingTeams.length === 0 && (
              <div className="text-center py-8 text-[#928dab]">
                No {filterStatus} teams found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Change Log */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Status Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusLogs.map((log) => (
              <div key={log.id} className="p-3 bg-black/20 rounded border border-[#7303c0]/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{log.team_name}</p>
                    <div className="flex items-center gap-2 text-sm text-[#928dab] mt-1">
                      <Badge className={`${getStatusColor(log.old_status)} text-white text-xs`}>
                        {log.old_status}
                      </Badge>
                      <span>→</span>
                      <Badge className={`${getStatusColor(log.new_status)} text-white text-xs`}>
                        {log.new_status}
                      </Badge>
                    </div>
                    {log.comment && (
                      <p className="text-sm text-[#928dab] mt-2 italic">"{log.comment}"</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-[#928dab]">
                    <p>by {log.admin_name}</p>
                    <p>{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {statusLogs.length === 0 && (
              <div className="text-center py-8 text-[#928dab]">
                No status changes recorded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
