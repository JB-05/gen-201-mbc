'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistrationsTable } from './RegistrationsTable';
import { DistrictInsights } from './DistrictInsights';
import { StatusManagement } from './StatusManagement';
import { PaymentInsights } from './PaymentInsights';
import { LogOut, Users, MapPin, CreditCard, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  shortlistedRegistrations: number;
  rejectedRegistrations: number;
  verifiedRegistrations: number;
  totalRevenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    shortlistedRegistrations: 0,
    rejectedRegistrations: 0,
    verifiedRegistrations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Call the admin dashboard stats function
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_admin_dashboard_stats') as {
          data: Array<{
            total_registrations: number;
            pending_registrations: number;
            shortlisted_registrations: number;
            rejected_registrations: number;
            verified_registrations: number;
            total_revenue: number;
          }> | null;
          error: any;
        };

      if (statsError) throw statsError;

      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        const dbStats = statsData[0];
        setStats({
          totalRegistrations: Number(dbStats.total_registrations) || 0,
          pendingRegistrations: Number(dbStats.pending_registrations) || 0,
          shortlistedRegistrations: Number(dbStats.shortlisted_registrations) || 0,
          rejectedRegistrations: Number(dbStats.rejected_registrations) || 0,
          verifiedRegistrations: Number(dbStats.verified_registrations) || 0,
          totalRevenue: Math.round(Number(dbStats.total_revenue) / 100) || 0, // Convert from paise to rupees
        });
      } else {
        // Set default values if no data
        setStats({
          totalRegistrations: 0,
          pendingRegistrations: 0,
          shortlistedRegistrations: 0,
          rejectedRegistrations: 0,
          verifiedRegistrations: 0,
          totalRevenue: 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      // Set default values on error
      setStats({
        totalRegistrations: 0,
        pendingRegistrations: 0,
        shortlistedRegistrations: 0,
        rejectedRegistrations: 0,
        verifiedRegistrations: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
      } else {
        toast.success('Signed out successfully');
        // Force redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#928dab]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-[#7303c0]/50 shadow-lg shadow-[#7303c0]/10">
        <div className="bg-gradient-to-r from-transparent via-[#7303c0]/5 to-transparent">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[#7303c0] to-[#928dab] rounded-full"></div>
                <h1 className="text-2xl font-orbitron gradient-text font-bold tracking-wider">
                  GEN 201 Admin Dashboard
                </h1>
              </div>
              <Button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border border-red-400/30 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/40 shadow-lg shadow-[#7303c0]/10 hover:shadow-xl hover:shadow-[#7303c0]/20 transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#928dab]">
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-[#7303c0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalRegistrations}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/40 shadow-lg shadow-[#7303c0]/10 hover:shadow-xl hover:shadow-[#7303c0]/20 transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#928dab]">
                Pending Review
              </CardTitle>
              <Settings className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.pendingRegistrations}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/40 shadow-lg shadow-[#7303c0]/10 hover:shadow-xl hover:shadow-[#7303c0]/20 transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#928dab]">
                Shortlisted
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.shortlistedRegistrations}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/40 shadow-lg shadow-[#7303c0]/10 hover:shadow-xl hover:shadow-[#7303c0]/20 transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#928dab]">
                Total Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <div className="bg-gradient-to-br from-black/5 via-[#7303c0]/5 to-black/10 backdrop-blur-2xl border border-[#7303c0]/20 rounded-3xl p-8 shadow-2xl shadow-[#7303c0]/15">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <TabsList className="grid grid-cols-4 col-span-full bg-transparent p-0 gap-4 h-auto">
                <TabsTrigger 
                  value="registrations" 
                  className="group relative overflow-hidden bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 rounded-2xl p-6 h-auto flex flex-col items-center gap-3 hover:border-[#7303c0]/60 hover:shadow-lg hover:shadow-[#7303c0]/20 transition-all duration-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#7303c0]/20 data-[state=active]:via-[#928dab]/15 data-[state=active]:to-[#7303c0]/10 data-[state=active]:border-[#7303c0] data-[state=active]:shadow-2xl data-[state=active]:shadow-[#7303c0]/30 data-[state=active]:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7303c0]/10 via-transparent to-[#928dab]/10 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <Users className="w-8 h-8 text-[#7303c0] group-data-[state=active]:text-white transition-colors duration-300" />
                  <div className="text-center relative z-10">
                    <div className="font-semibold text-white group-data-[state=active]:text-white">Registrations</div>
                    <div className="text-xs text-[#928dab] group-data-[state=active]:text-white/80 mt-1">Manage Teams</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="districts" 
                  className="group relative overflow-hidden bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 rounded-2xl p-6 h-auto flex flex-col items-center gap-3 hover:border-[#7303c0]/60 hover:shadow-lg hover:shadow-[#7303c0]/20 transition-all duration-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#7303c0]/20 data-[state=active]:via-[#928dab]/15 data-[state=active]:to-[#7303c0]/10 data-[state=active]:border-[#7303c0] data-[state=active]:shadow-2xl data-[state=active]:shadow-[#7303c0]/30 data-[state=active]:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7303c0]/10 via-transparent to-[#928dab]/10 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <MapPin className="w-8 h-8 text-[#7303c0] group-data-[state=active]:text-white transition-colors duration-300" />
                  <div className="text-center relative z-10">
                    <div className="font-semibold text-white group-data-[state=active]:text-white">District Insights</div>
                    <div className="text-xs text-[#928dab] group-data-[state=active]:text-white/80 mt-1">Regional Data</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="status" 
                  className="group relative overflow-hidden bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 rounded-2xl p-6 h-auto flex flex-col items-center gap-3 hover:border-[#7303c0]/60 hover:shadow-lg hover:shadow-[#7303c0]/20 transition-all duration-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#7303c0]/20 data-[state=active]:via-[#928dab]/15 data-[state=active]:to-[#7303c0]/10 data-[state=active]:border-[#7303c0] data-[state=active]:shadow-2xl data-[state=active]:shadow-[#7303c0]/30 data-[state=active]:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7303c0]/10 via-transparent to-[#928dab]/10 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <Settings className="w-8 h-8 text-[#7303c0] group-data-[state=active]:text-white transition-colors duration-300" />
                  <div className="text-center relative z-10">
                    <div className="font-semibold text-white group-data-[state=active]:text-white">Status Management</div>
                    <div className="text-xs text-[#928dab] group-data-[state=active]:text-white/80 mt-1">Review & Update</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="payments" 
                  className="group relative overflow-hidden bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 rounded-2xl p-6 h-auto flex flex-col items-center gap-3 hover:border-[#7303c0]/60 hover:shadow-lg hover:shadow-[#7303c0]/20 transition-all duration-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#7303c0]/20 data-[state=active]:via-[#928dab]/15 data-[state=active]:to-[#7303c0]/10 data-[state=active]:border-[#7303c0] data-[state=active]:shadow-2xl data-[state=active]:shadow-[#7303c0]/30 data-[state=active]:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7303c0]/10 via-transparent to-[#928dab]/10 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <CreditCard className="w-8 h-8 text-[#7303c0] group-data-[state=active]:text-white transition-colors duration-300" />
                  <div className="text-center relative z-10">
                    <div className="font-semibold text-white group-data-[state=active]:text-white">Payment Insights</div>
                    <div className="text-xs text-[#928dab] group-data-[state=active]:text-white/80 mt-1">Financial Overview</div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="registrations" className="bg-gradient-to-br from-black/10 via-black/5 to-black/15 backdrop-blur-2xl border border-[#7303c0]/25 rounded-2xl p-8 shadow-2xl shadow-[#7303c0]/10 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              {activeTab === 'registrations' && <RegistrationsTable onStatsChange={loadDashboardStats} />}
            </TabsContent>

            <TabsContent value="districts" className="bg-gradient-to-br from-black/10 via-black/5 to-black/15 backdrop-blur-2xl border border-[#7303c0]/25 rounded-2xl p-8 shadow-2xl shadow-[#7303c0]/10 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              {activeTab === 'districts' && <DistrictInsights />}
            </TabsContent>

            <TabsContent value="status" className="bg-gradient-to-br from-black/10 via-black/5 to-black/15 backdrop-blur-2xl border border-[#7303c0]/25 rounded-2xl p-8 shadow-2xl shadow-[#7303c0]/10 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              {activeTab === 'status' && <StatusManagement onStatsChange={loadDashboardStats} />}
            </TabsContent>

            <TabsContent value="payments" className="bg-gradient-to-br from-black/10 via-black/5 to-black/15 backdrop-blur-2xl border border-[#7303c0]/25 rounded-2xl p-8 shadow-2xl shadow-[#7303c0]/10 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              {activeTab === 'payments' && <PaymentInsights />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
