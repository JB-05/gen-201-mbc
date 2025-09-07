'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Download, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TeamRegistration {
  id: string;
  team_name: string;
  school_name: string;
  school_district: string;
  lead_email: string;
  lead_phone: string;
  registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified';
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  member_count?: number;
  team_members?: Array<{
    name: string;
    email: string;
    phone: string;
    grade: string;
    is_team_lead: boolean;
  }>;
}

interface RegistrationsTableProps {
  onStatsChange: () => void;
}

export function RegistrationsTable({ onStatsChange }: RegistrationsTableProps) {
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<TeamRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, statusFilter, districtFilter]);

  const loadRegistrations = async () => {
    try {
      // Use optimized RPC function for better performance
      const { data: teams, error: teamsError } = await supabase
        .rpc('get_teams_with_member_count') as {
          data: Array<{
            id: string;
            team_name: string;
            school_name: string;
            school_district: string;
            lead_email: string;
            lead_phone: string;
            registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified';
            payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
            created_at: string;
            member_count: number;
          }> | null;
          error: any;
        };

      if (teamsError) {
        // Fallback to original query if RPC fails
        console.warn('RPC failed, using fallback query:', teamsError);
        const { data: fallbackTeams, error: fallbackError } = await supabase
          .from('teams')
          .select(`
            id,
            team_name,
            school_name,
            school_district,
            lead_email,
            lead_phone,
            registration_status,
            created_at,
            team_members (id)
          `)
          .order('created_at', { ascending: false }) as {
            data: Array<{
              id: string;
              team_name: string;
              school_name: string;
              school_district: string;
              lead_email: string;
              lead_phone: string;
              registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified';
              created_at: string;
              team_members?: Array<{ id: string }>;
            }> | null;
            error: any;
          };

        if (fallbackError) throw fallbackError;

        const teamsWithCount = fallbackTeams?.map(team => ({
          ...team,
          member_count: team.team_members?.length || 0,
          team_members: undefined
        })) || [];

        setRegistrations(teamsWithCount);
      } else {
        setRegistrations(teams || []);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.lead_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.school_district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.registration_status === statusFilter);
    }

    // District filter
    if (districtFilter !== 'all') {
      filtered = filtered.filter(reg => reg.school_district === districtFilter);
    }

    setFilteredRegistrations(filtered);
  };

  const updateRegistrationStatus = async (teamId: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('teams')
        .update({ registration_status: newStatus })
        .eq('id', teamId);

      if (error) throw error;

      await loadRegistrations();
      onStatsChange();
      toast.success('Registration status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update registration status');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Team Name', 'School', 'District', 'Lead Email', 'Lead Phone', 
      'Status', 'Payment Status', 'Registration Date', 'Team Size'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.team_name,
      reg.school_name,
      reg.school_district,
      reg.lead_email,
      reg.lead_phone,
      reg.registration_status,
      reg.payment_status || 'pending',
      new Date(reg.created_at).toLocaleDateString(),
      reg.team_members?.length || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gen201_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const getUniqueDistricts = () => {
    const districts = Array.from(new Set(registrations.map(reg => reg.school_district)));
    return districts.sort();
  };

  if (loading) {
    return (
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-6">
          <div className="text-center text-[#928dab]">Loading registrations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-white">Team Registrations</CardTitle>
          <Button
            onClick={exportToCSV}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#928dab] w-4 h-4" />
              <CustomInput
                placeholder="Search teams, schools, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-[#7303c0] text-white"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-black/50 border-[#7303c0] text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-black border-[#7303c0]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={districtFilter} onValueChange={setDistrictFilter}>
            <SelectTrigger className="w-48 bg-black/50 border-[#7303c0] text-white">
              <SelectValue placeholder="Filter by district" />
            </SelectTrigger>
            <SelectContent className="bg-black border-[#7303c0]">
              <SelectItem value="all">All Districts</SelectItem>
              {getUniqueDistricts().map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-[#7303c0]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#7303c0]">
                <TableHead className="text-[#928dab]">Team Name</TableHead>
                <TableHead className="text-[#928dab]">School</TableHead>
                <TableHead className="text-[#928dab]">District</TableHead>
                <TableHead className="text-[#928dab]">Lead Contact</TableHead>
                <TableHead className="text-[#928dab]">Status</TableHead>
                <TableHead className="text-[#928dab]">Members</TableHead>
                <TableHead className="text-[#928dab]">Date</TableHead>
                <TableHead className="text-[#928dab]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id} className="border-[#7303c0]">
                  <TableCell className="font-medium text-white">
                    {registration.team_name}
                  </TableCell>
                  <TableCell className="text-[#928dab]">
                    {registration.school_name}
                  </TableCell>
                  <TableCell className="text-[#928dab]">
                    {registration.school_district}
                  </TableCell>
                  <TableCell className="text-[#928dab]">
                    <div className="text-sm">
                      <div>{registration.lead_email}</div>
                      <div>{registration.lead_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(registration.registration_status)} text-white`}>
                      {registration.registration_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#928dab]">
                    {registration.member_count || registration.team_members?.length || 0}
                  </TableCell>
                  <TableCell className="text-[#928dab]">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTeam(registration)}
                        className="border-[#7303c0] text-[#7303c0] hover:bg-[#7303c0] hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Select
                        value={registration.registration_status}
                        onValueChange={(value) => updateRegistrationStatus(registration.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-black/50 border-[#7303c0] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-[#7303c0]">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shortlisted">Shortlist</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                          <SelectItem value="verified">Verify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-8 text-[#928dab]">
            No registrations found matching your filters.
          </div>
        )}
      </CardContent>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-[#7303c0] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-orbitron gradient-text">
                {selectedTeam.team_name}
              </h3>
              <Button
                onClick={() => setSelectedTeam(null)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">School Details</h4>
                <p className="text-[#928dab]">{selectedTeam.school_name}</p>
                <p className="text-[#928dab]">{selectedTeam.school_district}</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Team Members</h4>
                <div className="space-y-2">
                  {selectedTeam.team_members?.map((member, index) => (
                    <div key={index} className="bg-black/30 p-3 rounded border border-[#7303c0]/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">
                            {member.name} {member.is_team_lead && '(Lead)'}
                          </p>
                          <p className="text-sm text-[#928dab]">{member.email}</p>
                          <p className="text-sm text-[#928dab]">{member.phone}</p>
                        </div>
                        <Badge className="bg-[#7303c0] text-white">
                          Grade {member.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
