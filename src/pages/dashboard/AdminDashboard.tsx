import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
];

const bookingData = [
  { name: 'Mon', count: 120 },
  { name: 'Tue', count: 150 },
  { name: 'Wed', count: 180 },
  { name: 'Thu', count: 140 },
  { name: 'Fri', count: 210 },
  { name: 'Sat', count: 250 },
  { name: 'Sun', count: 190 },
];

export function AdminDashboard() {
  const kpis = [
    { label: 'Total Users', value: '24,512', delta: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Caregivers', value: '1,842', delta: '+5%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Monthly Bookings', value: '8,240', delta: '+18%', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Revenue', value: '$1.2M', delta: '+22%', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentCaregivers = [
    { name: 'Dr. Emily Blunt', specialty: 'Physiotherapy', status: 'Pending', joined: '2h ago' },
    { name: 'Marcus Aurelius', specialty: 'Elderly Nursing', status: 'Verified', joined: 'Oct 12, 2023' },
    { name: 'Serena Williams', specialty: 'Dementia Care', status: 'Rejected', joined: 'Oct 10, 2023' },
  ];

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
            <p className="text-slate-500">Global oversight of Care24 healthcare ecosystem.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> Export Reports
            </Button>
            <Button className="rounded-full">
              Manage System
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map((kpi, i) => (
            <Card key={i} className="rounded-[24px] border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon size={24} />
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full">
                    <TrendingUp size={12} className="mr-1" /> {kpi.delta}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="rounded-[32px] border-none shadow-lg overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly platform revenue (caregiver fees + premiums)</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0F52BA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0F52BA" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-lg overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle>Daily Bookings</CardTitle>
              <CardDescription>Total healthcare service requests per day</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#4B0082" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-[32px] border-none shadow-lg">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Verification Queue</CardTitle>
                <CardDescription>Pending caregiver certification reviews</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <Input placeholder="Search..." className="pl-10 h-9 w-[200px] rounded-full border-slate-200" />
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-bold"><Filter size={14} className="mr-1" /> Filter</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="pl-8">Caregiver</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCaregivers.map((cg, i) => (
                    <TableRow key={i} className="border-slate-50 hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex items-center space-x-3 py-2">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{cg.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-900">{cg.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600">{cg.specialty}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{cg.joined}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-full px-3 py-1 border-none font-bold text-[10px] uppercase tracking-wider ${
                          cg.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          cg.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {cg.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-full">
                            <CheckCircle size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-full">
                            <XCircle size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-full">
                            <MoreVertical size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { title: 'Critical Server Load', time: '5m ago', type: 'critical' },
                { title: 'Payment Gateway delay', time: '12m ago', type: 'warning' },
                { title: 'Verification backend sync', time: '1h ago', type: 'info' },
                { title: 'New support ticket #4521', time: '2h ago', type: 'warning' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={`mt-1 p-1 rounded-full ${
                    alert.type === 'critical' ? 'bg-red-100 text-red-600' :
                    alert.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-full mt-4 bg-slate-50 border-slate-100">
                View All Events <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
