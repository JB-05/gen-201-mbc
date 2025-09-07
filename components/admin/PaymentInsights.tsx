'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentData {
  id: string;
  team_name: string;
  school_district: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id: string | null;
  order_id: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface PaymentStats {
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  averagePaymentTime: number;
  conversionRate: number;
}

export function PaymentInsights() {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    averagePaymentTime: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      // Load payment records
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          teams (team_name, school_district)
        `)
        .order('created_at', { ascending: false }) as {
          data: Array<{
            id: string;
            team_id: string;
            order_id: string;
            payment_id: string | null;
            signature: string | null;
            amount: number;
            currency: string;
            payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
            payment_method: string | null;
            razorpay_order_id: string | null;
            failure_reason: string | null;
            created_at: string;
            updated_at: string;
            teams: {
              team_name: string;
              school_district: string;
            } | null;
          }> | null;
          error: any;
        };

      if (paymentsError) throw paymentsError;

      const formattedPayments = payments?.map(payment => ({
        id: payment.id,
        team_name: payment.teams?.team_name || 'Unknown Team',
        school_district: payment.teams?.school_district || 'Unknown District',
        payment_status: payment.payment_status,
        payment_id: payment.payment_id,
        order_id: payment.order_id,
        amount: payment.amount,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      })) || [];

      setPaymentData(formattedPayments);

      // Calculate stats
      const totalRevenue = formattedPayments
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const completedPayments = formattedPayments.filter(p => p.payment_status === 'completed').length;
      const pendingPayments = formattedPayments.filter(p => p.payment_status === 'pending').length;
      const failedPayments = formattedPayments.filter(p => p.payment_status === 'failed').length;

      const conversionRate = formattedPayments.length > 0 
        ? (completedPayments / formattedPayments.length) * 100 
        : 0;

      // Calculate average payment completion time (in minutes)
      const completedPaymentsWithTime = formattedPayments
        .filter(p => p.payment_status === 'completed')
        .map(p => {
          const created = new Date(p.created_at).getTime();
          const updated = new Date(p.updated_at).getTime();
          return (updated - created) / (1000 * 60); // Convert to minutes
        });

      const averagePaymentTime = completedPaymentsWithTime.length > 0
        ? completedPaymentsWithTime.reduce((sum, time) => sum + time, 0) / completedPaymentsWithTime.length
        : 0;

      setPaymentStats({
        totalRevenue,
        completedPayments,
        pendingPayments,
        failedPayments,
        averagePaymentTime,
        conversionRate,
      });

    } catch (error) {
      console.error('Error loading payment data:', error);
      toast.error('Failed to load payment insights');
    } finally {
      setLoading(false);
    }
  };

  const exportPaymentData = () => {
    const headers = [
      'Team Name', 'District', 'Payment Status', 'Payment ID', 'Order ID', 
      'Amount', 'Created Date', 'Completed Date'
    ];

    const csvData = paymentData.map(payment => [
      payment.team_name,
      payment.school_district,
      payment.payment_status,
      payment.payment_id || '',
      payment.order_id,
      payment.amount,
      new Date(payment.created_at).toLocaleString(),
      payment.payment_status === 'completed' ? new Date(payment.updated_at).toLocaleString() : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gen201_payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-[#928dab]">Loading payment insights...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{paymentStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#928dab]">
              From {paymentStats.completedPayments} payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#7303c0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {paymentStats.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-[#928dab]">
              Payment success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Pending Payments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {paymentStats.pendingPayments}
            </div>
            <p className="text-xs text-[#928dab]">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#928dab]">
              Avg. Payment Time
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {paymentStats.averagePaymentTime.toFixed(1)}m
            </div>
            <p className="text-xs text-[#928dab]">
              Time to complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/30 backdrop-blur-sm border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              {paymentStats.completedPayments}
            </div>
            <div className="text-lg text-green-400">
              ₹{paymentStats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              {paymentStats.pendingPayments}
            </div>
            <div className="text-lg text-yellow-400">
              ₹{(paymentStats.pendingPayments * 50).toLocaleString()} potential
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border-red-500">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              {paymentStats.failedPayments}
            </div>
            <div className="text-lg text-red-400">
              ₹{(paymentStats.failedPayments * 50).toLocaleString()} lost
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Records Table */}
      <Card className="bg-black/20 backdrop-blur-lg border border-[#7303c0]/30 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">Payment Records</CardTitle>
            <Button
              onClick={exportPaymentData}
              className="bg-[#7303c0] hover:bg-[#928dab] text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#7303c0]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#7303c0]">
                  <TableHead className="text-[#928dab]">Team Name</TableHead>
                  <TableHead className="text-[#928dab]">District</TableHead>
                  <TableHead className="text-[#928dab]">Status</TableHead>
                  <TableHead className="text-[#928dab]">Payment ID</TableHead>
                  <TableHead className="text-[#928dab]">Amount</TableHead>
                  <TableHead className="text-[#928dab]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentData.map((payment) => (
                  <TableRow key={payment.id} className="border-[#7303c0]">
                    <TableCell className="font-medium text-white">
                      {payment.team_name}
                    </TableCell>
                    <TableCell className="text-[#928dab]">
                      {payment.school_district}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPaymentStatusColor(payment.payment_status)} text-white flex items-center gap-1 w-fit`}>
                        {getPaymentStatusIcon(payment.payment_status)}
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#928dab] font-mono text-sm">
                      {payment.payment_id || 'N/A'}
                    </TableCell>
                    <TableCell className="text-white">
                      ₹{payment.amount}
                    </TableCell>
                    <TableCell className="text-[#928dab]">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paymentData.length === 0 && (
            <div className="text-center py-8 text-[#928dab]">
              No payment records found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
