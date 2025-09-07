'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, Users, School } from 'lucide-react';
import { toast } from 'sonner';

interface DistrictData {
  district: string;
  totalTeams: number;
  totalSchools: number;
  pendingTeams: number;
  shortlistedTeams: number;
  rejectedTeams: number;
  verifiedTeams: number;
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
}

export function DistrictInsights() {
  const [districtData, setDistrictData] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDistricts, setTopDistricts] = useState<DistrictData[]>([]);

  useEffect(() => {
    loadDistrictData();
  }, []);

  const loadDistrictData = async () => {
    try {
      // Use optimized RPC function for better performance
      const { data: districts, error } = await supabase
        .rpc('get_district_insights') as {
          data: Array<{
            district: string;
            total_teams: number;
            total_schools: number;
            pending_teams: number;
            shortlisted_teams: number;
            rejected_teams: number;
            verified_teams: number;
          }> | null;
          error: any;
        };

      if (error) {
        // Fallback to original query if RPC fails
        console.warn('District RPC failed, using fallback query:', error);
        const { data: teams, error: fallbackError } = await supabase
          .from('teams')
          .select('school_district, school_name, registration_status, created_at') as {
            data: Array<{
              school_district: string;
              school_name: string;
              registration_status: string;
              created_at: string;
            }> | null;
            error: any;
          };

        if (fallbackError) throw fallbackError;

        // Group data by district (original logic)
        const districtMap = new Map<string, any>();

        teams?.forEach(team => {
          const district = team.school_district;
          
          if (!districtMap.has(district)) {
            districtMap.set(district, {
              district,
              totalTeams: 0,
              schools: new Set(),
              pendingTeams: 0,
              shortlistedTeams: 0,
              rejectedTeams: 0,
              verifiedTeams: 0,
              registrationTrend: []
            });
          }

          const districtInfo = districtMap.get(district);
          districtInfo.totalTeams++;
          districtInfo.schools.add(team.school_name);
          
          switch (team.registration_status) {
            case 'pending':
              districtInfo.pendingTeams++;
              break;
            case 'shortlisted':
              districtInfo.shortlistedTeams++;
              break;
            case 'rejected':
              districtInfo.rejectedTeams++;
              break;
            case 'verified':
              districtInfo.verifiedTeams++;
              break;
          }
        });

        const districtArray = Array.from(districtMap.values()).map(district => ({
          ...district,
          totalSchools: district.schools.size,
          schools: undefined
        }));

        districtArray.sort((a, b) => b.totalTeams - a.totalTeams);
        setDistrictData(districtArray);
        setTopDistricts(districtArray.slice(0, 5));
      } else {
        // Use RPC results directly
        const districtArray = districts?.map(district => ({
          ...district,
          totalTeams: Number(district.total_teams),
          totalSchools: Number(district.total_schools),
          pendingTeams: Number(district.pending_teams),
          shortlistedTeams: Number(district.shortlisted_teams),
          rejectedTeams: Number(district.rejected_teams),
          verifiedTeams: Number(district.verified_teams),
          registrationTrend: []
        })) || [];

        setDistrictData(districtArray);
        setTopDistricts(districtArray.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading district data:', error);
      toast.error('Failed to load district insights');
    } finally {
      setLoading(false);
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
          <div className="text-center text-[#928dab]">Loading district insights...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Total Districts
            </CardTitle>
            <MapPin className="h-4 w-4 text-[#7303c0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {districtData.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Top District
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {topDistricts[0]?.district || 'N/A'}
            </div>
            <p className="text-xs text-[#928dab]">
              {topDistricts[0]?.totalTeams || 0} teams
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Avg Teams per District
            </CardTitle>
            <Users className="h-4 w-4 text-[#7303c0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {districtData.length > 0 
                ? Math.round(districtData.reduce((sum, d) => sum + d.totalTeams, 0) / districtData.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Districts Leaderboard */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Districts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDistricts.map((district, index) => (
              <div key={district.district} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-[#7303c0]/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7303c0] text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{district.district}</h3>
                    <p className="text-sm text-[#928dab]">
                      {district.totalSchools} schools participating
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {district.totalTeams}
                  </div>
                  <div className="text-sm text-[#928dab]">teams</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed District Breakdown */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            District-wise Registration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtData.map((district) => (
              <div key={district.district} className="p-4 bg-black/20 rounded-lg border border-[#7303c0]/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{district.district}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#928dab] mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {district.totalTeams} teams
                      </span>
                      <span className="flex items-center gap-1">
                        <School className="w-4 h-4" />
                        {district.totalSchools} schools
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {district.pendingTeams > 0 && (
                    <Badge className="bg-yellow-500 text-white">
                      {district.pendingTeams} Pending
                    </Badge>
                  )}
                  {district.shortlistedTeams > 0 && (
                    <Badge className="bg-green-500 text-white">
                      {district.shortlistedTeams} Shortlisted
                    </Badge>
                  )}
                  {district.verifiedTeams > 0 && (
                    <Badge className="bg-blue-500 text-white">
                      {district.verifiedTeams} Verified
                    </Badge>
                  )}
                  {district.rejectedTeams > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {district.rejectedTeams} Rejected
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#7303c0] h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((district.totalTeams / (topDistricts[0]?.totalTeams || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-[#928dab] mt-1">
                    {district.totalTeams > 0 ? 
                      `${Math.round((district.shortlistedTeams + district.verifiedTeams) / district.totalTeams * 100)}% success rate` :
                      'No teams yet'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          {districtData.length === 0 && (
            <div className="text-center py-8 text-[#928dab]">
              No district data available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
