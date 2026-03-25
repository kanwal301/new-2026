import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  Shield, 
  ShieldCheck,
  Fingerprint,
  Database,
  Terminal,
  Eye,
  Lock,
  RefreshCw,
  AlertTriangle,
  BarChart3, 
  Zap, 
  Link as LinkIcon, 
  Key, 
  Trophy, 
  Layers, 
  ClipboardCheck, 
  History,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronRight,
  LogOut,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  School,
  FileText,
  CreditCard,
  MessageSquare,
  Cpu,
  Download,
  Calendar as CalendarIcon,
  UserPlus,
  Building2,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Activity,
  MessageCircle,
  Medal,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  CheckCircle,
  XCircle,
  Mic,
  Video,
  Paperclip,
  Smile,
  Phone,
  Info,
  User,
  Mail,
  Send,
  Share2,
  Volume2,
  Monitor,
  PlayCircle,
  ShieldAlert,
  Camera,
  Scan,
  UserCheck,
  UserX,
  Wallet,
  QrCode,
  Receipt,
  Banknote,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { db, handleFirestoreError } from '../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { OperationType } from '../firebase';

interface AdminPortalProps {
  onLogout: () => void;
  language: 'en' | 'ur';
}

const COLORS = ['#0066cc', '#28a745', '#ffc107', '#fd7e14', '#dc3545'];

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout, language }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isRtl = language === 'ur';
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoadingUsers(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (role: string) => {
    try {
      const name = prompt(`Enter ${role} Name:`);
      const email = prompt(`Enter ${role} Email:`);
      if (!name || !email) return;

      await addDoc(collection(db, 'users'), {
        name,
        email,
        role,
        campus: 'Main Campus',
        status: 'Active',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  };

  const t = {
    en: {
      dashboard: 'Dashboard',
      users: 'User Management',
      school: 'School Management',
      lms: 'Course Management',
      exams: 'Exams & Assessment',
      finance: 'Fees & Finance',
      attendance: 'Attendance',
      communication: 'Communication',
      automation: 'Automation',
      integrations: 'Integrations',
      saas: 'SaaS Features',
      ai: 'AI Insights',
      security: 'Security',
      settings: 'System Settings',
      logout: 'Logout',
      welcome: 'Welcome, Admin',
      activeUsers: 'Active Users',
      courseCompletion: 'Course Completion',
      revenue: 'Revenue Trend',
      recentActivity: 'Recent Activity Logs',
      newWorkflow: 'New Workflow',
      connectApp: 'Connect External App',
      ssoStatus: 'SSO Status: Active',
      multiTenancy: 'Multi-Tenancy Management',
      compliance: 'Compliance Score',
      totalStudents: 'Total Students',
      totalTeachers: 'Total Teachers',
      totalParents: 'Total Parents',
      activeCampuses: 'Active Campuses',
      addTeacher: 'Add Teacher',
      addStudent: 'Add Student',
      createCourse: 'Create Course',
      createExam: 'Create Exam',
      collectFee: 'Collect Fee',
      sendAnnouncement: 'Send Announcement',
      aiPrediction: 'AI Performance Prediction',
      smartRecs: 'Smart Recommendations',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      users: 'صارفین کا انتظام',
      school: 'اسکول مینجمنٹ',
      lms: 'کورس مینجمنٹ',
      exams: 'امتحانات اور تشخیص',
      finance: 'فیس اور مالیات',
      attendance: 'حاضری',
      communication: 'مواصلات',
      automation: 'آٹومیشن',
      integrations: 'انٹیگریشنز',
      saas: 'SaaS خصوصیات',
      ai: 'AI بصیرت',
      security: 'سیکیورٹی',
      settings: 'سسٹم کی ترتیبات',
      logout: 'لاگ آؤٹ',
      welcome: 'خوش آمدید، ایڈمن',
      activeUsers: 'فعال صارفین',
      courseCompletion: 'کورس کی تکمیل',
      revenue: 'آمدنی کا رجحان',
      recentActivity: 'حالیہ سرگرمی لاگز',
      newWorkflow: 'نیا ورک فلو',
      connectApp: 'بیرونی ایپ منسلک کریں',
      ssoStatus: 'SSO کی حیثیت: فعال',
      multiTenancy: 'ملٹی ٹیننسی مینجمنٹ',
      compliance: 'تعمیل کا سکور',
      totalStudents: 'کل طلباء',
      totalTeachers: 'کل اساتذہ',
      totalParents: 'کل والدین',
      activeCampuses: 'فعال کیمپس',
      addTeacher: 'ٹیچر شامل کریں',
      addStudent: 'طالب علم شامل کریں',
      createCourse: 'کورس بنائیں',
      createExam: 'امتحان بنائیں',
      collectFee: 'فیس جمع کریں',
      sendAnnouncement: 'اعلان بھیجیں',
      aiPrediction: 'AI کارکردگی کی پیشن گوئی',
      smartRecs: 'سمارٹ سفارشات',
    }
  }[language];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.totalStudents, value: '2,450', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: t.totalTeachers, value: '120', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
          { label: t.activeCampuses, value: '4', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Monthly Revenue', value: 'PKR 1.2M', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="text-xs font-bold text-green-500">+8.2%</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">{t.revenue}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-[10px] h-7">Weekly</Button>
              <Button variant="primary" size="sm" className="text-[10px] h-7">Monthly</Button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', val: 4000, exp: 2400 },
                { name: 'Feb', val: 3000, exp: 1398 },
                { name: 'Mar', val: 5000, exp: 3800 },
                { name: 'Apr', val: 4500, exp: 3908 },
                { name: 'May', val: 6000, exp: 4800 },
                { name: 'Jun', val: 8000, exp: 3800 },
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="exp" stroke="#ff4d4d" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Attendance Overview</h3>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: 85 },
                    { name: 'Absent', value: 10 },
                    { name: 'Late', value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500" /> Present
              </span>
              <span className="font-bold">85%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Absent
              </span>
              <span className="font-bold">10%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" /> Late
              </span>
              <span className="font-bold">5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">AI Performance Insights</h3>
            <div className="p-1.5 bg-brand-50 rounded-lg">
              <Cpu className="w-4 h-4 text-brand-500" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-blue-900">Attendance Prediction</div>
                  <div className="text-xs text-blue-700 mt-1">AI predicts a 15% drop in attendance next week due to upcoming local holidays. Suggest sending reminders.</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-green-900">Smart Recommendations</div>
                  <div className="text-xs text-green-700 mt-1">Class 10-A is excelling in Mathematics. AI recommends introducing advanced Calculus modules.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">{t.recentActivity}</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Admin Sarah', action: 'Created new automation rule', time: '2 mins ago', icon: Zap, color: 'text-orange-500' },
              { user: 'System', action: 'SSO Login successful for 45 users', time: '15 mins ago', icon: Key, color: 'text-blue-500' },
              { user: 'HRIS Sync', action: 'Synchronized 12 new employees', time: '1 hour ago', icon: LinkIcon, color: 'text-green-500' },
              { user: 'Security Bot', action: 'Monthly audit completed', time: '3 hours ago', icon: Shield, color: 'text-purple-500' },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className={cn("p-2 rounded-lg bg-slate-100", log.color)}>
                  <log.icon className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-bold text-slate-800">{log.user}</div>
                  <div className="text-xs text-slate-500">{log.action}</div>
                </div>
                <div className="text-[10px] font-medium text-slate-400">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.users}</h2>
          <p className="text-sm text-slate-500">Manage teachers, students, and parents across all campuses</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={() => alert('Bulk import feature is being connected to the database. Please wait for the next update.')}
            />
            <Button variant="outline" className="gap-2 text-xs h-10">
              <Download className="w-4 h-4" /> Bulk Import
            </Button>
          </div>
          <Button variant="outline" className="gap-2 text-xs h-10" onClick={() => handleAddUser('Teacher')}>
            <UserPlus className="w-4 h-4" /> Add Teacher
          </Button>
          <Button variant="primary" className="gap-2 text-xs h-10" onClick={() => handleAddUser('Student')}>
            <UserPlus className="w-4 h-4" /> {t.addStudent}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Teachers', 'Students', 'Parents'].map((filter) => (
              <Button key={filter} variant={filter === 'All' ? 'primary' : 'ghost'} size="sm" className="text-[10px] h-8 px-4">
                {filter}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campus</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2"></div>
                    <p className="text-slate-500 text-xs">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-xs">
                    No users found. Add your first user to get started.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{user.campus}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        user.status === 'Active' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => {
    const feeStats = [
      { label: 'Total Collection', value: 'PKR 4.2M', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12.5%' },
      { label: 'Pending Fees', value: 'PKR 850K', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', trend: '-2.4%' },
      { label: 'JazzCash/EasyPaisa', value: 'PKR 1.8M', icon: Wallet, color: 'text-brand-500', bg: 'bg-brand-50', trend: '+18.2%' },
      { label: 'Bank Transfers', value: 'PKR 2.4M', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+5.1%' },
    ];

    const recentTransactions = [
      { id: 'TXN-9821', student: 'Ali Khan', amount: '12,500', method: 'JazzCash', date: 'Today, 10:45 AM', status: 'Success' },
      { id: 'TXN-9820', student: 'Sara Ahmed', amount: '12,500', method: 'EasyPaisa', date: 'Today, 09:30 AM', status: 'Success' },
      { id: 'TXN-9819', student: 'Zaid Malik', amount: '3,500', method: 'HBL IBFT', date: 'Yesterday', status: 'Success' },
      { id: 'TXN-9818', student: 'Hina Raza', amount: '12,500', method: 'Meezan Bank', date: 'Yesterday', status: 'Failed' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Fee <span className="text-brand-500">Management</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Monitor real-time collections and manage payment gateways.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Download className="w-4 h-4" /> Export Report
            </Button>
            <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
              <Plus className="w-4 h-4" /> Generate Invoices
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feeStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                  stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Collection Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Collection Trends</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Weekly</Button>
                  <Button variant="primary" size="sm" className="text-[10px] font-bold uppercase tracking-widest rounded-lg">Monthly</Button>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Week 1', amount: 850000 },
                    { name: 'Week 2', amount: 1200000 },
                    { name: 'Week 3', amount: 950000 },
                    { name: 'Week 4', amount: 1500000 },
                  ]}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real-time Transactions */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Real-time Transactions</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Feed</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Method</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.student}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900">PKR {row.amount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.method}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            row.status === 'Success' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                          )}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Gateway Status */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-6">Gateway Status</h3>
              <div className="space-y-4">
                {[
                  { name: 'JazzCash Merchant', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'EasyPaisa Business', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'HBL 1BILL API', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'Raast IBFT', status: 'Maintenance', color: 'bg-orange-500' },
                ].map((gw) => (
                  <div key={gw.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold">{gw.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", gw.color)} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{gw.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 border-white/20 text-white hover:bg-white/10 rounded-xl">
                <Settings className="w-4 h-4 mr-2" /> Gateway Settings
              </Button>
            </div>

            {/* Defaulter Alerts */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Defaulter Alerts</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-xs font-bold text-red-900 mb-1">12 Students Overdue</div>
                  <p className="text-[10px] text-red-600 leading-relaxed">
                    Total overdue amount: PKR 154,000. Automated reminders sent via SMS/WhatsApp.
                  </p>
                </div>
                <Button variant="primary" className="w-full rounded-xl shadow-lg shadow-brand-500/20">
                  Send Bulk Reminders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSaaS = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.saas}</h2>
          <p className="text-sm text-slate-500">Super Admin Dashboard for Multi-School Management</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Building2 className="w-4 h-4" /> Add New School
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'City Grammar School', plan: 'Enterprise', users: '1,200', revenue: 'PKR 450k', status: 'Active' },
          { name: 'Beaconhouse Academy', plan: 'Professional', users: '850', revenue: 'PKR 320k', status: 'Active' },
          { name: 'The Educators', plan: 'Basic', users: '400', revenue: 'PKR 150k', status: 'Trial' },
        ].map((school, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-50 rounded-xl">
                <School className="w-6 h-6 text-brand-500" />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                school.status === 'Active' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
              )}>{school.status}</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{school.name}</h4>
            <div className="text-xs text-slate-500 mb-4">Plan: {school.plan}</div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Users</div>
                <div className="text-sm font-bold text-slate-800">{school.users}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Revenue</div>
                <div className="text-sm font-bold text-slate-800">{school.revenue}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs">Manage Tenant</Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.automation}</h2>
          <p className="text-sm text-slate-500">Manage automated enrollment and certification rules</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" /> {t.newWorkflow}
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'Auto-Enroll: New Hires', trigger: 'HRIS Sync', action: 'Enroll in Onboarding Path', status: 'Active' },
          { name: 'Certification Renewal', trigger: 'Expiry < 30 days', action: 'Send Notification & Re-enroll', status: 'Active' },
          { name: 'Engagement Alert', trigger: 'Inactivity > 7 days', action: 'Send Slack Notification', status: 'Paused' },
        ].map((rule, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <div className="font-bold text-slate-800">{rule.name}</div>
                <div className="text-xs text-slate-500">Trigger: {rule.trigger} • Action: {rule.action}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                rule.status === 'Active' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
              )}>
                {rule.status}
              </span>
              <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.integrations}</h2>
          <p className="text-sm text-slate-500">Connect your LMS with external HRIS, CRM, and SIS systems</p>
        </div>
        <Button variant="outline" className="gap-2">
          <LinkIcon className="w-4 h-4" /> {t.connectApp}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Workday HRIS', status: 'Connected', lastSync: '10 mins ago', icon: Globe },
          { name: 'Salesforce CRM', status: 'Connected', lastSync: '2 hours ago', icon: Users },
          { name: 'Microsoft Azure SSO', status: 'Active', lastSync: 'Real-time', icon: Key },
          { name: 'Slack Notifications', status: 'Connected', lastSync: 'Real-time', icon: Bell },
          { name: 'Zoom Education', status: 'Disconnected', lastSync: 'Never', icon: Smartphone },
        ].map((app, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <app.icon className="w-6 h-6 text-slate-600" />
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                app.status === 'Connected' || app.status === 'Active' ? "bg-green-500" : "bg-red-500"
              )} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{app.name}</h4>
            <div className="text-xs text-slate-500 mb-4">{app.status} • Last sync: {app.lastSync}</div>
            <Button variant="ghost" size="sm" className="w-full text-xs">Configure</Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchool = () => (
    <div className="space-y-8">
      {/* Pro Level Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">Pro Level</span>
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Session Active
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold uppercase tracking-wider ml-2">
              <LinkIcon className="w-3 h-3" />
              Teacher LMS Synced
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            School <span className="text-brand-500">Management</span>
          </h2>
          <p className="text-slate-500 font-medium">Enterprise-grade ecosystem for campus operations and academic excellence.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Button variant="primary" className="gap-2 shadow-xl shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Add New Campus
          </Button>
        </div>
      </div>

      {/* Connection Status with Teacher LMS */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center border border-brand-500/30">
            <Cpu className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">System Integration</div>
            <h3 className="text-lg font-bold">Teacher LMS Sync Status</h3>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-brand-400">100%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Data Integrity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-green-400">Active</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Live Connection</div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          <Button variant="primary" size="sm" className="bg-white text-slate-900 hover:bg-slate-100 border-none px-6">
            Force Sync Now
          </Button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campus Overview */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-500" />
              Campus Infrastructure
            </h3>
            <button className="text-brand-500 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Main Campus (Islamabad)', students: 1240, teachers: 85, status: 'Optimal' },
              { name: 'City Branch (Lahore)', students: 850, teachers: 42, status: 'Growing' },
              { name: 'Elite Wing (Karachi)', students: 620, teachers: 38, status: 'Optimal' },
              { name: 'Junior Section', students: 450, teachers: 24, status: 'Maintenance' },
            ].map((campus, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-500/30 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 group-hover:text-brand-500 transition-colors">{campus.name}</h4>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    campus.status === 'Optimal' ? "bg-green-100 text-green-600" : 
                    campus.status === 'Growing' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {campus.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {campus.students}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {campus.teachers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Pro Features */}
        <div className="space-y-6">
          <div className="bg-brand-500 p-8 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden group">
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold mb-2 relative z-10">Pro Automation</h3>
            <p className="text-brand-100 text-sm mb-6 relative z-10">Automate class scheduling and teacher substitutions with AI.</p>
            <Button className="w-full bg-white text-brand-500 hover:bg-brand-50 border-none font-bold relative z-10">
              Launch AI Scheduler
            </Button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">LMS Sync Logs</h3>
            <div className="space-y-4">
              {[
                { event: 'Teacher Grades Synced', time: '2 mins ago', type: 'success' },
                { event: 'Attendance Batch Upload', time: '15 mins ago', type: 'success' },
                { event: 'New Course Assigned', time: '1 hour ago', type: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    log.type === 'success' ? "bg-green-500" : "bg-blue-500"
                  )} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{log.event}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const [isAiScanning, setIsAiScanning] = useState(false);

  const handleRefreshAi = () => {
    setIsAiScanning(true);
    setTimeout(() => setIsAiScanning(false), 2000);
  };

  const renderAiInsights = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">AI Engine v2.0</span>
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {isAiScanning ? 'Scanning Data...' : 'Real-time Analysis Active'}
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mt-2">
            AI <span className="text-brand-500">Insights</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Predictive analytics and personalized learning intelligence.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            variant="primary" 
            className="gap-2 relative overflow-hidden"
            onClick={handleRefreshAi}
            disabled={isAiScanning}
          >
            {isAiScanning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {isAiScanning && (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
          <Brain className="w-6 h-6 text-brand-500 animate-bounce" />
          <div className="flex-grow">
            <div className="h-2 bg-brand-200 rounded-full w-full overflow-hidden">
              <div className="h-full bg-brand-500 animate-progress" style={{ width: '100%' }} />
            </div>
            <p className="text-[10px] font-bold text-brand-600 uppercase mt-2">AI is processing student behavior patterns and performance metrics...</p>
          </div>
        </div>
      )}

      {/* Global AI Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">System Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-bold text-slate-800">Fully Automated</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Data Points</div>
          <div className="text-xl font-black text-slate-900">1.2M+</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prediction Accuracy</div>
          <div className="text-xl font-black text-brand-500">98.2%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Sync</div>
          <div className="text-xl font-black text-slate-900">Just Now</div>
        </div>
      </div>

      {/* 1. Student Performance & 2. Risk Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Insights */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Performance Insights</h3>
                <p className="text-xs text-slate-500">AI-driven subject analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-green-500">+12% growth</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Weak Subjects</div>
              <div className="text-lg font-black text-slate-900">Mathematics</div>
              <p className="text-xs text-slate-600 mt-1">Ali ka Math weak hai, Science strong hai</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Strong Areas</div>
              <div className="text-lg font-black text-slate-900">Computer Science</div>
              <p className="text-xs text-slate-600 mt-1">Logic building & coding skills are exceptional.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Improvement Trend</div>
              <div className="text-lg font-black text-slate-900">Steady Rise</div>
              <p className="text-xs text-slate-600 mt-1">Consistency improved by 15% this month.</p>
            </div>
          </div>

          <div className="mt-8 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Week 1', score: 65 },
                { name: 'Week 2', score: 72 },
                { name: 'Week 3', score: 68 },
                { name: 'Week 4', score: 85 },
              ]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Detection */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Risk Detection</h3>
              <p className="text-xs text-slate-500">Early Warning System</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-600 uppercase">Fail Risk</span>
                <span className="text-xl font-black text-red-600">70%</span>
              </div>
              <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] text-red-700 mt-2 font-medium">Student 70% risk pe hai exam fail hone ka</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-600 uppercase">Dropout Risk</span>
                <span className="text-xl font-black text-orange-600">25%</span>
              </div>
              <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '25%' }} />
              </div>
              <p className="text-[10px] text-orange-700 mt-2 font-medium">Low engagement in last 2 weeks.</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-yellow-600 uppercase">Attendance Risk</span>
                <span className="text-xl font-black text-yellow-600">Low</span>
              </div>
              <p className="text-[10px] text-yellow-700 mt-1 font-medium">Current: 65% (Threshold: 75%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Learning Progress & 4. Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Tracker */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Learning Progress Tracker</h3>
                <p className="text-xs text-slate-500">Weekly & Monthly growth</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="text-3xl font-black text-slate-900">88%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Weekly Progress</div>
              <div className="flex items-center justify-center gap-1 text-green-500 text-[10px] font-bold mt-2">
                <TrendingUp className="w-3 h-3" /> +5%
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="text-3xl font-black text-slate-900">74%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Skill Improvement</div>
              <div className="flex items-center justify-center gap-1 text-blue-500 text-[10px] font-bold mt-2">
                <TrendingUp className="w-3 h-3" /> +12%
              </div>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', progress: 40 },
                { name: 'Tue', progress: 60 },
                { name: 'Wed', progress: 45 },
                { name: 'Thu', progress: 80 },
                { name: 'Fri', progress: 75 },
                { name: 'Sat', progress: 90 },
                { name: 'Sun', progress: 85 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="progress" fill="#28a745" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Personalized Recommendations</h3>
              <p className="text-xs text-slate-500">Tailored learning path</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Revise Topic: Algebra</div>
                <p className="text-xs text-slate-600 mt-1">Algebra practice karo next 3 days. Focus on quadratic equations.</p>
                <button className="mt-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider hover:underline">Start Revision</button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Watch Video: Quantum Physics</div>
                <p className="text-xs text-slate-600 mt-1">New interactive simulation available for better understanding.</p>
                <button className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">Watch Now</button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Complete Assignment: History</div>
                <p className="text-xs text-slate-600 mt-1">Due in 2 days. AI predicts you need 45 mins to complete.</p>
                <button className="mt-2 text-[10px] font-bold text-orange-600 uppercase tracking-wider hover:underline">Open Assignment</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Goal Tracking & 6. Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Tracking */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Goal Tracking System</h3>
              <p className="text-xs text-slate-500">Target marks & improvement</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Exam Target: 90%</span>
                <span className="text-sm font-bold text-brand-500">70% Reached</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 inline mr-1" /> Tum apne goal se 20% peeche ho
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Goals</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Physics Improvement</span>
                  <span className="text-xs font-bold text-green-500">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">English Fluency</span>
                  <span className="text-xs font-bold text-blue-500">On Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Plan Generator */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Smart Study Plan Generator</h3>
                <p className="text-xs text-slate-500">AI-optimized daily schedule</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-wider">Regenerate Plan</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">01</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">2 ghante Math</div>
                  <p className="text-[10px] text-slate-500">Focus: Calculus & Geometry</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">02</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">1 ghanta English</div>
                  <p className="text-[10px] text-slate-500">Focus: Grammar & Essay Writing</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">03</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">30 mins Revision</div>
                  <p className="text-[10px] text-slate-500">Quick recap of today's learning</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-4">Subject Priority</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>MATHEMATICS</span>
                    <span>HIGH</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '90%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>SCIENCE</span>
                    <span>MEDIUM</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>HISTORY</span>
                    <span>LOW</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-300" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Teacher Insights & 8. Class Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher Insights */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Teacher Insights Panel</h3>
              <p className="text-xs text-slate-500">Student & Class performance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Weak Students List</div>
              <div className="flex flex-wrap gap-2">
                {['Ali Khan', 'Zainab Bibi', 'Umar Farooq'].map(name => (
                  <span key={name} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-red-600 border border-red-100">{name}</span>
                ))}
              </div>
              <p className="text-[10px] text-red-700 mt-2 font-medium">Class 10A me 60% students weak hain Math me</p>
            </div>

            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-2">Top Performers</div>
              <div className="flex flex-wrap gap-2">
                {['Sara Ahmed', 'Hamza Ali', 'Fatima Noor'].map(name => (
                  <span key={name} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-green-600 border border-green-100">{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Class Analytics */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <BarChart className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Class Analytics (Admin View)</h3>
              <p className="text-xs text-slate-500">Overall school performance</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl text-center">
              <div className="text-xl font-black text-slate-900">82%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Overall Perf.</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-center">
              <div className="text-xl font-black text-slate-900">Mr. Asif</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Best Teacher</div>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl text-center">
              <div className="text-xl font-black text-red-600">9B</div>
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mt-1">Weak Class</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Performance by Grade</div>
            <div className="flex items-end justify-between h-20 gap-2">
              {[40, 70, 85, 60, 90, 75].map((h, i) => (
                <div key={i} className="flex-grow bg-blue-500/20 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-1000" 
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 9. Behavior Analysis & 10. Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavior Analysis */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Behavior Analysis</h3>
              <p className="text-xs text-slate-500">Interest & Study patterns</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-600">Student Interest</span>
              <span className="text-xs font-bold text-brand-500">STEM Focused</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-600">Study Pattern</span>
              <span className="text-xs font-bold text-blue-500">Night Owl</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-600">Consistency</span>
              <span className="text-xs font-bold text-green-500">High (92%)</span>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center">“Student raat ko zyada active hai”</p>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Predictive Analytics</h3>
                <p className="text-xs text-slate-400">Future performance forecasting</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                <div className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-2">Final Exam Prediction</div>
                <div className="text-4xl font-black">88.4%</div>
                <div className="text-[10px] text-slate-400 mt-2">Confidence Score: 94%</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                <div className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-2">Predicted Rank</div>
                <div className="text-4xl font-black">#04</div>
                <div className="text-[10px] text-slate-400 mt-2">In Grade 10-A</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                <div className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-2">Success Chance</div>
                <div className="text-4xl font-black text-green-400">92%</div>
                <div className="text-[10px] text-slate-400 mt-2">University Admission</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 11. AI Chat Insights & 12. Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Chat Insights */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Chat Insights</h3>
              <p className="text-xs text-slate-500">Student Q&A Analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="self-end bg-slate-100 p-3 rounded-2xl rounded-tr-none text-xs text-slate-700 max-w-[80%]">
                “Main weak kyun hoon?”
              </div>
              <div className="self-start bg-brand-50 p-3 rounded-2xl rounded-tl-none text-xs text-brand-700 max-w-[80%] border border-brand-100">
                “Tum practice kam kar rahe ho. Last week tumne sirf 2 assignments complete kiye hain.”
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Common Questions</div>
              <div className="flex flex-wrap gap-2">
                {['How to improve Math?', 'Next exam date?', 'Study tips'].map(q => (
                  <button key={q} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-medium text-slate-600 hover:bg-slate-100 transition-colors">{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Insights */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <Medal className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gamification Insights</h3>
              <p className="text-xs text-slate-500">Points, Badges & Leaderboard</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">2,450</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">12</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badges Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">#03</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Rank</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-yellow-50/50 rounded-xl border border-yellow-100">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-slate-800">Speed Learner</div>
                <div className="text-[10px] text-slate-500">Completed 5 topics in 1 day</div>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-slate-800">Streak Master</div>
                <div className="text-[10px] text-slate-500">Login 7 days in a row</div>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Logic & Transparency Section */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">AI Logic & Transparency</h3>
            <p className="text-xs text-slate-500">How the AI Engine makes decisions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 font-mono text-[10px]">
            <div className="text-brand-600 mb-2 font-bold uppercase tracking-wider">// Risk Detection Logic</div>
            <div className="text-slate-800">
              <span className="text-purple-600">if</span> (student.marks &lt; <span className="text-blue-600">40</span>) &#123;<br />
              &nbsp;&nbsp;insight = <span className="text-green-600">"High risk student - needs attention"</span>;<br />
              &nbsp;&nbsp;triggerWarning(<span className="text-orange-600">"FAIL_RISK"</span>);<br />
              &#125; <span className="text-purple-600">else if</span> (student.attendance &lt; <span className="text-blue-600">75</span>) &#123;<br />
              &nbsp;&nbsp;triggerWarning(<span className="text-orange-600">"DROPOUT_RISK"</span>);<br />
              &#125;
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 font-mono text-[10px]">
            <div className="text-brand-600 mb-2 font-bold uppercase tracking-wider">// Performance Analysis</div>
            <div className="text-slate-800">
              <span className="text-purple-600">const</span> trend = calculateTrend(student.history);<br />
              <span className="text-purple-600">if</span> (trend === <span className="text-green-600">'UPWARD'</span>) &#123;<br />
              &nbsp;&nbsp;updateStatus(<span className="text-green-600">'IMPROVING'</span>);<br />
              &nbsp;&nbsp;generateReward(<span className="text-yellow-600">'PROGRESS_BADGE'</span>);<br />
              &#125;
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 font-mono text-[10px]">
            <div className="text-brand-600 mb-2 font-bold uppercase tracking-wider">// Recommendation Engine</div>
            <div className="text-slate-800">
              <span className="text-purple-600">const</span> weakTopics = analyzeWeakPoints(student.exams);<br />
              weakTopics.forEach(topic =&gt; &#123;<br />
              &nbsp;&nbsp;suggestContent(topic.relatedVideos);<br />
              &nbsp;&nbsp;schedulePractice(topic.next3Days);<br />
              &#125;);
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">PRO Security v3.0</span>
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Zero Trust Active
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mt-2">
            Security <span className="text-brand-500">Portal</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Enterprise-grade protection, AI threat intelligence, and compliance monitoring.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Terminal className="w-4 h-4" />
            Security Logs
          </Button>
          <Button variant="primary" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            Run Security Audit
          </Button>
        </div>
      </div>

      {/* Security Health & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Activity className="w-16 h-16 text-brand-500" />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Health Score</div>
          <div className="text-4xl font-black text-slate-900">98%</div>
          <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold mt-2">
            <TrendingUp className="w-3 h-3" /> Optimal
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blocked Attacks</div>
          <div className="text-4xl font-black text-slate-900">1,240</div>
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold mt-2">
            Last 24 hours
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Fingerprint className="w-16 h-16 text-brand-500" />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">MFA Adoption</div>
          <div className="text-4xl font-black text-slate-900">100%</div>
          <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold mt-2">
            Enforced
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Database className="w-16 h-16 text-brand-500" />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Backup Health</div>
          <div className="text-4xl font-black text-slate-900">100%</div>
          <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold mt-2">
            Daily Sync OK
          </div>
        </div>
      </div>

      {/* PRO Level Summary */}
      <div className="bg-brand-50 border border-brand-100 rounded-3xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-slate-900">PRO Level Security Summary</h3>
          <p className="text-sm text-slate-600 mt-1">
            Tumhara SaaS secure tab hoga jab: <span className="font-bold text-brand-600">Login secure ho, APIs protected ho, Data encrypted ho, aur Activity monitored ho.</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white rounded-full border border-brand-200 text-[10px] font-bold text-brand-600 uppercase">Login Secure ✔</div>
          <div className="px-3 py-1 bg-white rounded-full border border-brand-200 text-[10px] font-bold text-brand-600 uppercase">APIs Protected ✔</div>
          <div className="px-3 py-1 bg-white rounded-full border border-brand-200 text-[10px] font-bold text-brand-600 uppercase">Data Encrypted ✔</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Zero Trust & IAM */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Zero Trust & IAM</h3>
                <p className="text-xs text-slate-500">Identity & Access Management</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">Secure</span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Auth Method</div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-bold text-slate-800">JWT + MFA</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">RBAC Status</div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-bold text-slate-800">Fine-grained</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Session Control</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-bold text-slate-800">Auto-Logout</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white font-mono text-xs">
              <div className="text-brand-400 mb-2">// Zero Trust Policy Verification</div>
              <div className="space-y-1">
                <p><span className="text-purple-400">verify</span>(request.origin) <span className="text-green-400">=&gt;</span> <span className="text-slate-400">"TRUSTED_IP"</span></p>
                <p><span className="text-purple-400">verify</span>(user.role) <span className="text-green-400">=&gt;</span> <span className="text-slate-400">"ADMIN_ACCESS"</span></p>
                <p><span className="text-purple-400">verify</span>(device.fingerprint) <span className="text-green-400">=&gt;</span> <span className="text-slate-400">"MATCHED"</span></p>
                <p><span className="text-purple-400">check</span>(session.expiry) <span className="text-green-400">=&gt;</span> <span className="text-slate-400">"VALID"</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Security Monitoring */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Threat Intel</h3>
              <p className="text-xs text-slate-500">Anomaly Detection</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Suspicious Login</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">User "Ali" logged in from 5 different cities in 1 hour.</p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg">Block User</button>
                <button className="px-3 py-1 bg-white text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">Ignore</button>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Brute Force Attempt</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">IP 192.168.1.45 blocked after 5 failed attempts.</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Pattern Analysis</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">Normal behavior detected for 99.8% of users.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Data Protection & Encryption */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data Protection</h3>
              <p className="text-xs text-slate-500">Encryption & Compliance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-900">AES-256</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Encryption Standard</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-900">GDPR</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Compliance Status</div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Passwords', status: 'Hashed (Bcrypt)', secure: true },
              { label: 'Emails', status: 'Encrypted', secure: true },
              { label: 'Payments', status: 'Tokenized (PCI-DSS)', secure: true },
              { label: 'Logs', status: 'Immutable', secure: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-500">{item.status}</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Backup & Disaster Recovery */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Backup & Recovery</h3>
              <p className="text-xs text-slate-500">Automated Disaster Recovery</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
              <div>
                <div className="text-xs font-bold text-green-700">Daily Backup Complete</div>
                <div className="text-[10px] text-green-600">Last sync: 2 hours ago</div>
              </div>
              <Button size="sm" variant="primary" className="bg-green-600 hover:bg-green-700">Restore Now</Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Storage Usage</span>
                <span className="text-slate-500">45.2 GB / 100 GB</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">RPO</div>
                <div className="text-sm font-black text-slate-800">15 Minutes</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">RTO</div>
                <div className="text-sm font-black text-slate-800">2 Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Input Validation & Rate Limiting */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Input Validation & Rate Limiting</h3>
              <p className="text-xs text-slate-500">Anti-Injection & Brute Force Protection</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[10px]">
              <div className="text-orange-600 mb-2 font-bold uppercase tracking-wider">// Input Sanitization (XSS/SQLi)</div>
              <div className="text-slate-800">
                <span className="text-purple-600">const</span> cleanInput = sanitize(userInput);<br />
                <span className="text-purple-600">if</span> (cleanInput.contains(<span className="text-green-600">'&lt;script&gt;'</span>)) &#123;<br />
                &nbsp;&nbsp;blockRequest(<span className="text-red-600">"XSS_ATTEMPT"</span>);<br />
                &#125;
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="text-[10px] font-bold text-orange-600 uppercase mb-1">Rate Limit</div>
                <div className="text-lg font-black text-slate-900">5 Attempts</div>
                <p className="text-[10px] text-orange-700 mt-1">Block after 5 failed logins</p>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-[10px] font-bold text-green-600 uppercase mb-1">HTTPS Status</div>
                <div className="text-lg font-black text-slate-900">Enforced</div>
                <p className="text-[10px] text-green-700 mt-1">SSL/TLS 1.3 Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Session & Device Management */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Session & Device Management</h3>
              <p className="text-xs text-slate-500">Control User Login States</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">iPhone 15 Pro</div>
                  <div className="text-[10px] text-slate-500">London, UK • Active Now</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50">Logout</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Chrome on Windows</div>
                  <div className="text-[10px] text-slate-500">Karachi, PK • 2 hours ago</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50">Logout</Button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Auto Logout Timeout</span>
                <span className="text-brand-600 font-bold">30 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-purple-50 rounded-full text-[10px] font-bold text-purple-600 uppercase">Single Session Control Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pro Level Security Headings (SaaS LMS) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-6">PRO Level Security Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Zero Trust Architecture', desc: 'Kisi bhi user ya system par blind trust nahi. Har request verify hoti hai.' },
              { title: 'Advanced IAM', desc: 'Fine-grained access control. Har user ke permissions alag level par defined.' },
              { title: 'Multi-Factor Auth (MFA)', desc: 'Password + OTP / device verification. Single password enough nahi hota.' },
              { title: 'End-to-End Encryption', desc: 'Data at rest + in transit dono encrypted. Sensitive data readable nahi hota.' },
              { title: 'Secure API Gateway', desc: 'Centralized gateway protection. Rate limiting + auth + monitoring layer.' },
              { title: 'Advanced Threat Prevention', desc: 'Real-time attack detection (brute force, injection, bot attacks).' },
              { title: 'Continuous Monitoring', desc: 'SIEM Integration. Har activity log hoti hai central dashboard par.' },
              { title: 'AI Security Intelligence', desc: 'AI abnormal behavior detect karta hai (User pattern, login anomaly).' },
              { title: 'Automated Recovery', desc: 'Data loss zero ho. Instant recovery system ready ho daily backups ke sath.' },
              { title: 'Secure Session Control', desc: 'Session expiry + device tracking. Unknown device auto block system.' },
              { title: 'Penetration Testing', desc: 'Regular ethical hacking tests. Weak points identify aur fix kiye jate hain.' },
              { title: 'Global Compliance', desc: 'GDPR / data protection rules follow. User data legally secure ho.' },
              { title: 'Secure DevOps', desc: 'Development phase se hi security integrate. Code deploy se pehle scan.' },
              { title: 'Secrets Management', desc: 'API keys, tokens secure vault me store. Code me hardcoded nahi hote.' },
              { title: 'Incident Response', desc: 'Attack detect hote hi alert + auto response. Admin ko real-time notification.' },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-sm font-bold text-brand-400 mb-1">{item.title}</div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Exams & <span className="text-brand-500">Assessment</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Manage examinations, grading, and assessment security.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            {t.createExam}
          </Button>
        </div>
      </div>

      {/* Exam Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Exams', value: '48', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Now', value: '12', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Completed', value: '156', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Avg. Score', value: '74%', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* PRO Exam Security & Integrity Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ShieldCheck className="w-64 h-64 text-brand-500 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">PRO Exam Security & Integrity</h3>
              <p className="text-slate-400 text-sm font-medium">18-Layer Advanced Protection for Assessments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "1. User Authentication Security", desc: "Secure login system (password + MFA) with multi-role verification.", icon: Fingerprint },
              { title: "2. Role-Based Access Control (RBAC)", desc: "Strict access limits: Admin (Full), Teacher (Classes), Student (Own data).", icon: Users },
              { title: "3. Authorization & Permission", desc: "Real-time action verification. Unauthorized requests are instantly rejected.", icon: Lock },
              { title: "4. Data Protection & Encryption", desc: "AES-256 encryption for passwords and sensitive assessment data.", icon: Database },
              { title: "5. Secure API Layer", desc: "Token-based API protection with mandatory validation for all requests.", icon: LinkIcon },
              { title: "6. Input Validation & Attack Prevention", desc: "Built-in protection against SQL injection, XSS, and malicious inputs.", icon: Terminal },
              { title: "7. AI-Based Threat Detection", desc: "Detects suspicious behavior, unusual logins, and potential cheating.", icon: Brain },
              { title: "8. Activity Logging & Monitoring", desc: "Full audit trails for every user action with real-time admin logs.", icon: History },
              { title: "9. Real-Time Alerts & Response", desc: "Instant alerts for security incidents with automated mitigation.", icon: Bell },
              { title: "10. Backup & Disaster Recovery", desc: "Automated daily backups with one-click restore functionality.", icon: RefreshCw },
              { title: "11. Session & Device Management", desc: "Control active sessions and block access from unknown devices.", icon: Smartphone },
              { title: "12. Security Testing & Scanning", desc: "Regular automated penetration tests and vulnerability scanning.", icon: Zap },
              { title: "13. Secure Development (DevSecOps)", desc: "Security-first code architecture with pre-deployment scanning.", icon: Layers },
              { title: "14. Secret & Key Management", desc: "Highly secure storage for API keys and system secrets.", icon: Key },
              { title: "15. Data Privacy & Compliance", desc: "Full GDPR/compliance alignment for student data protection.", icon: Globe },
              { title: "16. Admin Security Control Panel", desc: "Centralized control for users, access, logs, and alerts.", icon: Shield },
              { title: "17. Teacher Security Controls", desc: "Restricted access to assigned classes only. No unauthorized edits.", icon: GraduationCap },
              { title: "18. Student Data Protection", desc: "Isolated data access ensuring students only see their own results.", icon: UserPlus },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-tight">Real-time Active</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Exams List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Assessments</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Exam Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Integrity</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Midterm Examination 2024', subject: 'Mathematics', date: '24 Mar 2024', students: 120, status: 'Active', integrity: 'Secure' },
                { name: 'Physics Quiz #4', subject: 'Physics', date: '22 Mar 2024', students: 85, status: 'Completed', integrity: 'Secure' },
                { name: 'English Literature Final', subject: 'English', date: '20 Mar 2024', students: 110, status: 'Completed', integrity: 'Secure' },
              ].map((exam, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{exam.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{exam.subject}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{exam.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-bold">{exam.students}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                      exam.status === 'Active' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      {exam.integrity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFees = () => {
    const feeStats = [
      { label: 'Total Collection', value: 'PKR 4.2M', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12.5%' },
      { label: 'Pending Fees', value: 'PKR 850K', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', trend: '-2.4%' },
      { label: 'JazzCash/EasyPaisa', value: 'PKR 1.8M', icon: Wallet, color: 'text-brand-500', bg: 'bg-brand-50', trend: '+18.2%' },
      { label: 'Bank Transfers', value: 'PKR 2.4M', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+5.1%' },
    ];

    const recentTransactions = [
      { id: 'TXN-9821', student: 'Ali Khan', amount: '12,500', method: 'JazzCash', date: 'Today, 10:45 AM', status: 'Success' },
      { id: 'TXN-9820', student: 'Sara Ahmed', amount: '12,500', method: 'EasyPaisa', date: 'Today, 09:30 AM', status: 'Success' },
      { id: 'TXN-9819', student: 'Zaid Malik', amount: '3,500', method: 'HBL IBFT', date: 'Yesterday', status: 'Success' },
      { id: 'TXN-9818', student: 'Hina Raza', amount: '12,500', method: 'Meezan Bank', date: 'Yesterday', status: 'Failed' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Fee <span className="text-brand-500">Management</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Monitor real-time collections and manage payment gateways.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Download className="w-4 h-4" /> Export Report
            </Button>
            <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
              <Plus className="w-4 h-4" /> Generate Invoices
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feeStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                  stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Collection Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Collection Trends</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Weekly</Button>
                  <Button variant="primary" size="sm" className="text-[10px] font-bold uppercase tracking-widest rounded-lg">Monthly</Button>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Week 1', amount: 850000 },
                    { name: 'Week 2', amount: 1200000 },
                    { name: 'Week 3', amount: 950000 },
                    { name: 'Week 4', amount: 1500000 },
                  ]}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real-time Transactions */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Real-time Transactions</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Feed</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Method</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.student}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900">PKR {row.amount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.method}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            row.status === 'Success' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                          )}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Gateway Settings */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-6">Gateway Status</h3>
              <div className="space-y-4">
                {[
                  { name: 'JazzCash Merchant', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'EasyPaisa Business', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'HBL 1BILL API', status: 'Active', color: 'bg-emerald-500' },
                  { name: 'Raast IBFT', status: 'Maintenance', color: 'bg-orange-500' },
                ].map((gw) => (
                  <div key={gw.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold">{gw.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", gw.color)} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{gw.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 border-white/20 text-white hover:bg-white/10 rounded-xl">
                <Settings className="w-4 h-4 mr-2" /> Gateway Settings
              </Button>
            </div>

            {/* Defaulter Alerts */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Defaulter Alerts</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-xs font-bold text-red-900 mb-1">12 Students Overdue</div>
                  <p className="text-[10px] text-red-600 leading-relaxed">
                    Total overdue amount: PKR 154,000. Automated reminders sent via SMS/WhatsApp.
                  </p>
                </div>
                <Button variant="primary" className="w-full rounded-xl shadow-lg shadow-brand-500/20">
                  Send Bulk Reminders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            AI Face <span className="text-brand-500">Attendance</span> Engine
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Fully automated biometric recognition & real-time cloud sync.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Scan className="w-4 h-4" />
            Scan Database
          </Button>
          <Button variant="primary" className="gap-2">
            <Camera className="w-4 h-4" />
            Launch Live Scanner
          </Button>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Present Today', value: '1,142', icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Absent Today', value: '98', icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Late Arrivals', value: '45', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Avg. Attendance', value: '94.2%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Scanner Preview */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Scanner Active</span>
              </div>
              <div className="text-xs font-medium text-slate-400">Camera: Front-Facing (HD)</div>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative">
              {/* Face Scan Overlay */}
              <div className="w-64 h-64 border-2 border-brand-500/50 rounded-3xl relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-lg" />
                
                {/* Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50 shadow-[0_0_15px_rgba(0,102,204,0.8)] animate-scan" />
              </div>

              {/* Detected Student Info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 w-[80%]">
                <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-lg">AS</div>
                <div className="flex-grow">
                  <div className="text-sm font-bold">Ahmed Sheikh</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-tight">Grade 10-B • Roll #42</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-bold text-green-400 uppercase">Match 98.4%</div>
                  <div className="text-[10px] text-slate-400">Verified</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">Switch Camera</button>
              <button className="px-6 py-2 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold transition-all">Manual Capture</button>
            </div>
          </div>
        </div>

        {/* Real-time Feed & Alerts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Recent Verifications</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Feed</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sara Malik', time: '08:42 AM', status: 'Present', match: '99.2%', img: 'SM' },
                { name: 'Zaid Khan', time: '08:41 AM', status: 'Present', match: '97.8%', img: 'ZK' },
                { name: 'Ayesha Ali', time: '08:39 AM', status: 'Late', match: '98.5%', img: 'AA' },
                { name: 'Hamza Ahmed', time: '08:35 AM', status: 'Present', match: '96.4%', img: 'HA' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs">{log.img}</div>
                  <div className="flex-grow">
                    <div className="text-sm font-bold text-slate-800">{log.name}</div>
                    <div className="text-[10px] text-slate-400">{log.time} • Match {log.match}</div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                    log.status === 'Present' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {log.status}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs">View Full Logs</Button>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Low Attendance Alerts</h4>
                <p className="text-[10px] text-red-600 font-medium">12 Students below 75% threshold</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white/50 rounded-xl">
                <span className="text-xs font-bold text-slate-700">Bilal Ahmed (Grade 9)</span>
                <span className="text-xs font-black text-red-600">62%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/50 rounded-xl">
                <span className="text-xs font-bold text-slate-700">Fatima Noor (Grade 10)</span>
                <span className="text-xs font-black text-red-600">68%</span>
              </div>
            </div>
            <button className="w-full mt-4 text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline">Notify Parents Now</button>
          </div>
        </div>
      </div>

      {/* AI Attendance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Attendance Insights</h3>
              <p className="text-xs text-slate-500 font-medium">Pattern analysis & predictive absence detection.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">Weekly</button>
              <button className="px-3 py-1 bg-brand-500 rounded-lg text-[10px] font-bold text-white uppercase shadow-lg shadow-brand-500/20">Monthly</button>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Week 1', attendance: 92, target: 95 },
                { name: 'Week 2', attendance: 94, target: 95 },
                { name: 'Week 3', attendance: 88, target: 95 },
                { name: 'Week 4', attendance: 95, target: 95 },
                { name: 'Week 5', attendance: 91, target: 95 },
              ]}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Late Pattern Detected</div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">Grade 10-A shows a 15% increase in late arrivals on Monday mornings.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="text-[10px] font-bold text-purple-600 uppercase mb-1">Predictive Absence</div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">AI predicts a 10% drop in attendance next Friday due to local holiday patterns.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black tracking-tight leading-none">AI Attendance<br/><span className="text-brand-400">Pro Features</span></h3>
          </div>

          <div className="space-y-4 flex-grow">
            {[
              { title: "Anti-Spoofing Engine", desc: "Prevents photo/video cheating.", icon: ShieldCheck },
              { title: "Cloud Real-time Sync", desc: "Instant update across all devices.", icon: RefreshCw },
              { title: "Auto-Report Generation", desc: "Monthly attendance PDFs.", icon: FileText },
              { title: "Parent SMS Alerts", desc: "Instant notification on absence.", icon: Bell },
              { title: "Multi-Device Support", desc: "Mobile, Tablet & CCTV integration.", icon: Smartphone },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="primary" className="w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest">Upgrade to Enterprise</Button>
        </div>
      </div>

      {/* Manual Override & Management Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Management</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Manual override, editing, and detailed class reports.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search student..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter Class
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-8 py-4">Student Name</th>
                <th className="px-8 py-4">Class</th>
                <th className="px-8 py-4">Check-in Time</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Method</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Ahmed Sheikh', class: 'Grade 10-B', time: '08:15 AM', status: 'Present', method: 'AI Face Scan', img: 'AS' },
                { name: 'Sara Malik', class: 'Grade 10-B', time: '08:22 AM', status: 'Present', method: 'AI Face Scan', img: 'SM' },
                { name: 'Zaid Khan', class: 'Grade 10-B', time: '08:45 AM', status: 'Late', method: 'Manual Override', img: 'ZK' },
                { name: 'Ayesha Ali', class: 'Grade 10-B', time: '--:--', status: 'Absent', method: 'System Auto', img: 'AA' },
                { name: 'Hamza Ahmed', class: 'Grade 10-B', time: '08:10 AM', status: 'Present', method: 'AI Face Scan', img: 'HA' },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs">{student.img}</div>
                      <div className="text-sm font-bold text-slate-800">{student.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-600 font-medium">{student.class}</td>
                  <td className="px-8 py-4 text-sm text-slate-500 font-mono">{student.time}</td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      student.status === 'Present' ? "bg-green-50 text-green-600" : 
                      student.status === 'Late' ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      {student.method === 'AI Face Scan' ? <Scan className="w-3 h-3 text-brand-500" /> : <Settings className="w-3 h-3 text-orange-500" />}
                      {student.method}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all" title="Edit Attendance"><Settings className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all" title="View History"><History className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 1,240 students</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* PRO Attendance Features Grid */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Scan className="w-64 h-64 text-brand-500 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">PRO AI Attendance Module</h3>
              <p className="text-slate-400 text-sm font-medium">15-Layer Advanced Biometric Recognition & Analytics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "1. AI Face Recognition Engine", desc: "Advanced neural networks for 99.9% accurate student face matching.", icon: Brain },
              { title: "2. Smart Face Capture & Verification", desc: "Real-time biometric capture with high-speed verification logic.", icon: Camera },
              { title: "3. Cloud-Based Attendance Storage", desc: "Instant sync to secure cloud database with zero data loss.", icon: Database },
              { title: "4. Teacher Attendance Dashboard", desc: "Dedicated view for teachers to manage daily class attendance.", icon: LayoutDashboard },
              { title: "5. Admin Control Panel", desc: "Full system access to override, edit, and manage all records.", icon: Shield },
              { title: "6. Manual Override & Editing", desc: "Flexible backup system to manually adjust records when needed.", icon: Settings },
              { title: "7. Real-Time Attendance Monitoring", desc: "Live dashboard showing instant present/absent status updates.", icon: Activity },
              { title: "8. Automated Monthly Reports", desc: "Auto-generated PDF reports with detailed attendance analytics.", icon: FileText },
              { title: "9. Low Attendance Alert System", desc: "Automated notifications for students falling below threshold.", icon: AlertTriangle },
              { title: "10. AI Attendance Insights", desc: "Deep analysis of absence patterns and late arrival trends.", icon: TrendingUp },
              { title: "11. Multi-Device Support", desc: "Run on dedicated school cameras, tablets, or mobile devices.", icon: Smartphone },
              { title: "12. Secure Face Data Management", desc: "End-to-end encryption for biometric data and user privacy.", icon: Lock },
              { title: "13. Anti-Cheating & Fraud Detection", desc: "Liveness detection to prevent photo or video spoofing attacks.", icon: ShieldCheck },
              { title: "14. Instant Notification System", desc: "Real-time SMS/App alerts to parents upon attendance marking.", icon: Bell },
              { title: "15. Attendance Analytics Dashboard", desc: "Comprehensive graphs and charts for data-driven decisions.", icon: BarChart3 },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-tight">Real-time Active</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Unified <span className="text-brand-500">Communication</span> Hub
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time connectivity for Admin, Teachers, Students, and Parents.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Video className="w-4 h-4" />
            Start Live Class
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            New Broadcast
          </Button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Chats', value: '1,240', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Live Classes', value: '12', icon: Video, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Broadcasts Sent', value: '85', icon: Volume2, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Avg. Response', value: '2.4m', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        {/* Sidebar: Contacts & Groups */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {[
              { name: 'Grade 10 - Mathematics', type: 'Group', lastMsg: 'Don\'t forget the assignment!', time: '10:45 AM', unread: 3, online: true },
              { name: 'Prof. Ahmed Ali', type: 'Teacher', lastMsg: 'The midterm results are ready.', time: 'Yesterday', unread: 0, online: true },
              { name: 'Parent: Mrs. Khan', type: 'Parent', lastMsg: 'Thank you for the update.', time: '2 days ago', unread: 0, online: false },
              { name: 'Student: Sara Malik', type: 'Student', lastMsg: 'I have a doubt in Chapter 4.', time: '3 days ago', unread: 1, online: true },
              { name: 'Staff Announcements', type: 'Broadcast', lastMsg: 'Meeting at 2 PM today.', time: '4 days ago', unread: 0, online: true },
            ].map((chat, i) => (
              <button key={i} className="w-full p-4 rounded-2xl hover:bg-slate-50 transition-all text-left flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                    {chat.name.substring(0, 2).toUpperCase()}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-brand-500/20">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Window */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 font-bold">
                G10
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Grade 10 - Mathematics</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">42 Students Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Video className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Info className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today</span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 text-xs font-bold">TA</div>
              <div className="max-w-[70%]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-700 leading-relaxed">Assalam-o-Alaikum students! Please review the notes for Chapter 5 before tomorrow's class.</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Teacher Ahmed • 10:30 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-4 flex-row-reverse">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white text-xs font-bold">KM</div>
              <div className="max-w-[70%] flex flex-col items-end">
                <div className="bg-brand-500 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-brand-500/20 text-white">
                  <p className="text-sm leading-relaxed">I've uploaded the PDF notes to the LMS. You can access them now.</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">10:32 AM</span>
                  <CheckCircle2 className="w-3 h-3 text-brand-500" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 text-xs font-bold">S1</div>
              <div className="max-w-[70%]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-700 leading-relaxed">Thank you sir! I'll check it right away.</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Student Sara • 10:35 AM</span>
              </div>
            </div>

            {/* AI Smart Reply Suggestion */}
            <div className="flex justify-center">
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl flex items-center gap-4 max-w-md animate-pulse">
                <Brain className="w-5 h-5 text-purple-500" />
                <div className="flex-grow">
                  <div className="text-[10px] font-bold text-purple-600 uppercase mb-1">AI Smart Reply</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-purple-200 rounded-lg text-[10px] font-medium text-purple-700 hover:bg-purple-50 transition-colors">"You're welcome!"</button>
                    <button className="px-3 py-1 bg-white border border-purple-200 rounded-lg text-[10px] font-medium text-purple-700 hover:bg-purple-50 transition-colors">"Let me know if you need help."</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Paperclip className="w-5 h-5" /></button>
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-brand-500 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="p-3 bg-brand-500 text-white rounded-2xl shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRO Communication Features Grid */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <MessageSquare className="w-64 h-64 text-brand-500 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">PRO Communication Module</h3>
              <p className="text-slate-400 text-sm font-medium">17-Layer Advanced Connectivity & Engagement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "1. Unified Communication Hub", desc: "Centralized system for Admin, Teacher, Student, and Parent interaction.", icon: LayoutDashboard },
              { title: "2. Real-Time Chat System", desc: "Instant messaging with one-to-one and group chat capabilities.", icon: MessageCircle },
              { title: "3. Announcements & Broadcast", desc: "Send mass messages and important notices instantly to everyone.", icon: Volume2 },
              { title: "4. Teacher-Student Messaging", desc: "Direct channel for study help and doubt solving sessions.", icon: GraduationCap },
              { title: "5. Parent Communication Channel", desc: "Keep parents updated on results, attendance, and behavior.", icon: Users },
              { title: "6. Smart Notification System", desc: "Real-time alerts for assignments, exams, and new messages.", icon: Bell },
              { title: "7. Multi-Channel Messaging", desc: "Support for In-app messages, Email, and SMS notifications.", icon: Mail },
              { title: "8. Live Class & Video", desc: "Integrated online classes with video, audio, and screen sharing.", icon: Video },
              { title: "9. File & Media Sharing", desc: "Secure exchange of documents, PDFs, images, and study materials.", icon: Paperclip },
              { title: "10. AI Smart Replies", desc: "AI-suggested replies and automated answers for basic queries.", icon: Brain },
              { title: "11. Communication Analytics", desc: "Track message activity, response times, and engagement levels.", icon: BarChart3 },
              { title: "12. Secure Messaging System", desc: "End-to-end encryption ensuring private communication is safe.", icon: Lock },
              { title: "13. Moderation & Control", desc: "AI-powered detection of spam and abuse with admin controls.", icon: ShieldAlert },
              { title: "14. Event & Meeting Scheduler", desc: "Schedule meetings with automatic reminders for all participants.", icon: CalendarIcon },
              { title: "15. Message History & Records", desc: "Easily search and access archived chat history and records.", icon: History },
              { title: "16. Admin Control Panel", desc: "Centralized management for broadcasts and user permissions.", icon: Shield },
              { title: "17. Multi-Language Support", desc: "Full support for English, Urdu, and other regional languages.", icon: Globe },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-tight">Real-time Active</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.settings}</h2>
          <p className="text-sm text-slate-500">Configure global platform settings and branding</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-brand-500" />
            CEO Image Management (Carousel)
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center group hover:border-brand-500 transition-colors relative overflow-hidden">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Image {i + 1}</div>
                  <Plus className="w-8 h-8 text-slate-300 group-hover:text-brand-500 transition-colors" />
                  <div className="text-[10px] text-slate-400 mt-2">Click to upload new CEO photo</div>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={() => alert('Image upload feature is being integrated with cloud storage. This will be available once Firebase is fully configured.')}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-center italic">Recommended: 800x1000px</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-500" />
            General Branding
          </h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Platform Name</label>
                <input type="text" defaultValue="Pak Education LMS" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Support Email</label>
                <input type="email" defaultValue="support@pakeducation.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
            <Button variant="primary" className="w-full sm:w-auto">Save Changes</Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              System Security & Protection (PRO)
            </h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
              High Security Mode Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'auth', title: 'User Authentication Security', desc: 'Secure login with MFA & multi-role verification.', icon: Key, enabled: true },
              { id: 'rbac', title: 'Role-Based Access Control (RBAC)', desc: 'Limit access based on Admin, Teacher, or Student roles.', icon: Users, enabled: true },
              { id: 'perm', title: 'Authorization & Permissions', desc: 'Verify every action and reject unauthorized requests.', icon: ShieldCheck, enabled: true },
              { id: 'enc', title: 'Data Protection & Encryption', desc: 'End-to-end encryption for passwords and personal data.', icon: Lock, enabled: true },
              { id: 'api', title: 'Secure API Layer', desc: 'Token-based protection and validation for all APIs.', icon: LinkIcon, enabled: true },
              { id: 'input', title: 'Input Validation & Attack Prevention', desc: 'Block SQL injection, XSS, and malicious inputs.', icon: Terminal, enabled: true },
              { id: 'ai_threat', title: 'AI-Based Threat Detection', desc: 'Detect suspicious behavior and unusual login patterns.', icon: Brain, enabled: true },
              { id: 'logs', title: 'Activity Logging & Monitoring', desc: 'Track all user activities with comprehensive logs.', icon: FileText, enabled: true },
              { id: 'alerts', title: 'Real-Time Alerts & Response', desc: 'Instant alerts and automated actions on threats.', icon: Bell, enabled: true },
              { id: 'backup', title: 'Backup & Disaster Recovery', desc: 'Daily automated backups and instant restore system.', icon: RefreshCw, enabled: true },
              { id: 'session', title: 'Session & Device Management', desc: 'Control login sessions and block unknown devices.', icon: Smartphone, enabled: true },
              { id: 'testing', title: 'Security Testing & Scanning', desc: 'Regular penetration tests and vulnerability scans.', icon: ClipboardCheck, enabled: true },
              { id: 'devsecops', title: 'Secure Development (DevSecOps)', desc: 'Security integrated into the development lifecycle.', icon: Layers, enabled: true },
              { id: 'secrets', title: 'Secret & Key Management', desc: 'Secure storage for API keys and sensitive tokens.', icon: Key, enabled: true },
              { id: 'privacy', title: 'Data Privacy & Compliance', desc: 'Follow global data protection rules and policies.', icon: Globe, enabled: true },
              { id: 'admin_ctrl', title: 'Admin Security Control Panel', desc: 'Centralized control for users, access, and logs.', icon: LayoutDashboard, enabled: true },
              { id: 'teacher_ctrl', title: 'Teacher Security Controls', desc: 'Restricted access to class-specific data only.', icon: School, enabled: true },
              { id: 'student_ctrl', title: 'Student Data Protection', desc: 'Strict isolation of student-specific information.', icon: GraduationCap, enabled: true },
            ].map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center h-6">
                    <div className={cn(
                      "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                      item.enabled ? "bg-brand-500" : "bg-slate-300"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        item.enabled ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-3">{item.desc}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-tight">Real-time Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 transition-all",
        isRtl ? "right-0" : "left-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-brand-500 p-1.5 rounded-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display">Admin LMS</span>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
          {[
            { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
            { id: 'users', label: t.users, icon: Users },
            { id: 'school', label: t.school, icon: School },
            { id: 'lms', label: t.lms, icon: BookOpen },
            { id: 'exams', label: t.exams, icon: ClipboardCheck },
            { id: 'finance', label: t.finance, icon: CreditCard },
            { id: 'attendance', label: t.attendance, icon: Scan },
            { id: 'communication', label: t.communication, icon: MessageSquare },
            { id: 'automation', label: t.automation, icon: Zap },
            { id: 'integrations', label: t.integrations, icon: LinkIcon },
            { id: 'saas', label: t.saas, icon: Globe },
            { id: 'ai', label: t.ai, icon: Cpu },
            { id: 'security', label: t.security, icon: Shield },
            { id: 'settings', label: t.settings, icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                activeTab === item.id 
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all",
        isRtl ? "mr-64" : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics, users, or courses..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t.ssoStatus}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Connected to Admin LMS
            </div>
            <button className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Kanwal Mehar</div>
                <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                KM
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'school' && renderSchool()}
          {activeTab === 'exams' && renderExams()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'communication' && renderCommunication()}
          {activeTab === 'finance' && renderFinance()}
          {activeTab === 'saas' && renderSaaS()}
          {activeTab === 'automation' && renderAutomation()}
          {activeTab === 'integrations' && renderIntegrations()}
          {activeTab === 'ai' && renderAiInsights()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'settings' && renderSettings()}
          {['lms'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Module Under Development</h2>
              <p className="text-slate-500 max-w-md">The {activeTab} module is currently being optimized for high-performance SaaS operations.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
