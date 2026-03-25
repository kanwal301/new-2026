import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  Shield, 
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
  Baby,
  User,
  MapPin,
  Activity,
  Heart,
  Clock,
  ExternalLink,
  Moon,
  Sun,
  CheckCircle,
  X,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Share2,
  Paperclip,
  Edit,
  Camera,
  Image as ImageIcon,
  File as FileIcon,
  Smile,
  Mic,
  MoreHorizontal,
  Mail as MailIcon,
  Megaphone,
  CalendarDays,
  Star,
  ThumbsUp,
  Reply,
  MessageCircle,
  Send,
  Wallet,
  QrCode,
  Receipt,
  CreditCard as CreditCardIcon,
  Banknote,
  History as HistoryIcon,
  ArrowRight,
  CheckCircle2 as CheckCircleIcon
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
  Line,
  Legend
} from 'recharts';
import { db, handleFirestoreError } from '../firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { OperationType } from '../firebase';

interface ParentPortalProps {
  onLogout: () => void;
  language: 'en' | 'ur';
}

const COLORS = ['#0066cc', '#28a745', '#ffc107', '#fd7e14', '#dc3545'];

export const ParentPortal: React.FC<ParentPortalProps> = ({ onLogout, language }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fees, setFees] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    // In a real app, we'd filter by parentId or studentId
    const q = query(collection(db, 'fees'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFees(feesData);
      setLoadingFees(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'fees');
      setLoadingFees(false);
    });

    return () => unsubscribe();
  }, []);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [commTab, setCommTab] = useState<'messages' | 'alerts' | 'events'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStep, setPaymentStep] = useState<'dashboard' | 'checkout' | 'success'>('dashboard');
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [selectedChild, setSelectedChild] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    academic: true,
    attendance: true,
    diary: true,
    ai: true,
    fees: true,
    events: true
  });
  const [showCustomize, setShowCustomize] = useState(false);
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; teacher: string } | null>(null);
  const guidanceRef = useRef<HTMLDivElement>(null);
  const children = [
    { id: 0, name: 'Ali Khan', class: '10-A', roll: '24', photo: 'https://picsum.photos/seed/ali/200' },
    { id: 1, name: 'Sara Khan', class: '8-B', roll: '12', photo: 'https://picsum.photos/seed/sara/200' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 15000); // Toggle every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const isRtl = language === 'ur';

  const t = {
    en: {
      dashboard: 'Dashboard',
      performance: 'Performance',
      attendance: 'Attendance',
      homework: 'Homework',
      communication: 'Communication',
      fees: 'Fees & Payments',
      tracking: 'Bus Tracking',
      guidance: 'Child Insights',
      documents: 'Documents',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome, Parent',
      childSummary: 'Child Summary',
      todayUpdates: "Today's Updates",
      alerts: 'Alerts',
      feesDue: 'Fees Due',
      upcomingExams: 'Upcoming Exams',
      payNow: 'Pay Now',
      viewReport: 'View Report',
      whatsappAlert: 'WhatsApp Notification: Child Arrived at School',
      smartAssistant: 'Smart Parent Assistant',
      weakSubjects: 'Weak Subjects Highlight',
      behavior: 'Behavior Tracking',
      health: 'Health Updates',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      performance: 'کارکردگی',
      attendance: 'حاضری',
      homework: 'ہوم ورک',
      communication: 'مواصلات',
      fees: 'فیس اور ادائیگیاں',
      tracking: 'بس ٹریکنگ',
      guidance: 'بچے کی بصیرت',
      documents: 'دستاویزات',
      settings: 'ترتیبات',
      logout: 'لاگ آؤٹ',
      welcome: 'خوش آمدید، والدین',
      childSummary: 'بچے کا خلاصہ',
      todayUpdates: 'آج کی اپ ڈیٹس',
      alerts: 'الرٹس',
      feesDue: 'واجب الادا فیس',
      upcomingExams: 'آنے والے امتحانات',
      payNow: 'ابھی ادائیگی کریں',
      viewReport: 'رپورٹ دیکھیں',
      whatsappAlert: 'واٹس ایپ اطلاع: بچہ اسکول پہنچ گیا ہے',
      smartAssistant: 'سمارٹ پیرنٹ اسسٹنٹ',
      weakSubjects: 'کمزور مضامین کی نشاندہی',
      behavior: 'برتاؤ کی ٹریکنگ',
      health: 'صحت کی اپ ڈیٹس',
    }
  }[language];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Child Summary Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold border-4 border-white shadow-lg">
          AK
        </div>
        <div className="text-center md:text-left flex-grow">
          <h2 className="text-2xl font-bold text-slate-900">Ali Khan</h2>
          <p className="text-slate-500 font-medium">Grade 10-A • Roll No: 42</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {language === 'en' ? 'At School' : 'اسکول میں ہے'}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> {language === 'en' ? 'Active in Class' : 'کلاس میں فعال'}
            </span>
          </div>
        </div>
        <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 text-center">
          <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mb-1">{t.whatsappAlert}</div>
          <div className="text-sm font-bold text-brand-700 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            08:45 AM Today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance', value: '94%', icon: CalendarIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Avg. Marks', value: '82%', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Pending Fees', value: 'PKR 12,500', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Behavior', value: 'Excellent', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={cn("p-2 rounded-lg w-fit mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Graph */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">{t.performance}</h3>
              <Button variant="ghost" size="sm" className="text-xs">{t.viewReport}</Button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Unit 1', marks: 75 },
                  { name: 'Unit 2', marks: 82 },
                  { name: 'Midterm', marks: 78 },
                  { name: 'Unit 3', marks: 85 },
                  { name: 'Unit 4', marks: 90 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="marks" stroke="#0066cc" strokeWidth={3} dot={{ r: 6, fill: '#0066cc', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Homework */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6">{t.homework}</h3>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', task: 'Exercise 4.2 Questions 1-10', status: 'Pending', deadline: 'Tomorrow' },
                { subject: 'Physics', task: 'Lab Report on Light Reflection', status: 'Submitted', deadline: 'Today' },
                { subject: 'English', task: 'Essay on Digital Education', status: 'Pending', deadline: '2 days left' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <BookOpen className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.subject}</div>
                      <div className="text-xs text-slate-500">{item.task}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      item.status === 'Submitted' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                    )}>{item.status}</span>
                    <div className="text-[10px] text-slate-400 mt-1">{item.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Smart Assistant */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6" />
              <h3 className="font-bold">{t.smartAssistant}</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-xs font-bold mb-1">💡 Improvement Tip</div>
                <div className="text-[11px] opacity-90">Ali is struggling with Algebra. AI suggests 15 mins of extra practice on Exercise 4.2 tonight.</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-xs font-bold mb-1">📅 Upcoming Test</div>
                <div className="text-[11px] opacity-90">Physics test scheduled for Friday. Revise "Light Reflection" notes.</div>
              </div>
            </div>
          </div>

          {/* Fees Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">{t.feesDue}</h3>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-4">
              <div className="text-xs text-red-600 font-bold uppercase mb-1">March 2026 Tuition</div>
              <div className="text-2xl font-bold text-red-900">PKR 12,500</div>
              <div className="text-[10px] text-red-500 mt-1">Due Date: 10 Mar 2026</div>
            </div>
            <Button variant="primary" className="w-full gap-2">
              <CreditCard className="w-4 h-4" /> {t.payNow}
            </Button>
          </div>

          {/* Transport Tracking */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">{t.tracking}</h3>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">Live</span>
            </div>
            <div className="aspect-video bg-slate-100 rounded-xl relative overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-700">
                Bus #14: Near Main Market (5 mins away)
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
              <ExternalLink className="w-4 h-4" /> Open Full Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => {
    const attendanceData = [
      { date: '2026-03-24', status: 'Present', time: '08:42 AM', reason: '-' },
      { date: '2026-03-23', status: 'Present', time: '08:35 AM', reason: '-' },
      { date: '2026-03-22', status: 'Late', time: '09:15 AM', reason: 'Traffic' },
      { date: '2026-03-21', status: 'Absent', time: '-', reason: 'Fever' },
      { date: '2026-03-20', status: 'Present', time: '08:40 AM', reason: '-' },
      { date: '2026-03-19', status: 'Present', time: '08:38 AM', reason: '-' },
    ];

    const chartData = [
      { name: 'Present', value: 85, color: '#10b981' },
      { name: 'Absent', value: 5, color: '#ef4444' },
      { name: 'Late', value: 10, color: '#f59e0b' },
    ];

    return (
      <div className={cn(
        "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
        isDarkMode ? "dark bg-slate-900 text-white -m-8 p-8 min-h-screen" : ""
      )}>
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500 p-10 text-white shadow-2xl shadow-brand-500/20">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <ClipboardCheck className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-black tracking-tight leading-none">
                    {language === 'en' ? "My Child's Attendance Overview" : "بچوں کی حاضری کا جائزہ"}
                  </h2>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30 animate-pulse">
                    Real-time
                  </span>
                </div>
                <p className="text-brand-100 font-medium opacity-90">
                  {language === 'en' ? "Track daily presence, monthly trends and leave records." : "روزانہ کی حاضری، ماہانہ رجحانات اور چھٹیوں کے ریکارڈ کو ٹریک کریں۔"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button className="bg-white text-brand-600 hover:bg-brand-50 rounded-2xl font-bold px-6 shadow-lg shadow-black/10">
                {language === 'en' ? "Leave Mark Karo" : "چھٹی مارک کریں"}
              </Button>
            </div>
          </div>
        </div>

        {/* Low Attendance Warning */}
        {showWarning && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900 dark:text-red-300">
                  {language === 'en' ? "Low Attendance Warning!" : "کم حاضری کا انتباہ!"}
                </h4>
                <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                  {language === 'en' ? "Ali's attendance is below 90%. Please ensure regular attendance." : "علی کی حاضری 90٪ سے کم ہے۔ براہ کرم باقاعدہ حاضری کو یقینی بنائیں۔"}
                </p>
              </div>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-red-400 hover:text-red-600 transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: language === 'en' ? 'Aaj Present' : 'آج حاضر', value: 'Yes', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: language === 'en' ? 'Mahine Ka %' : 'ماہانہ فیصد', value: '94.5%', icon: BarChart3, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
              { label: language === 'en' ? 'Late Marks' : 'لیٹ مارکس', value: '02', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            ].map((stat, i) => (
              <div key={i} className={cn(
                "p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md",
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
              )}>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={cn(
            "md:col-span-4 p-6 rounded-3xl border shadow-sm flex flex-col justify-between",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          )}>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={language === 'en' ? "Search student..." : "طالب علم تلاش کریں..."}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all",
                    isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                  )}
                />
              </div>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all",
                    isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-grow gap-2 rounded-xl">
                <FileSpreadsheet className="w-4 h-4" /> Export
              </Button>
              <Button variant="outline" className="rounded-xl p-3">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Charts and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Attendance Table */}
          <div className={cn(
            "lg:col-span-8 rounded-[2.5rem] border shadow-sm overflow-hidden",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          )}>
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">
                {language === 'en' ? "Attendance History" : "حاضری کی تاریخ"}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notifications</span>
                <div className="w-10 h-5 bg-brand-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {attendanceData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{row.date}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit",
                          row.status === 'Present' ? "bg-emerald-100 text-emerald-600" : 
                          row.status === 'Late' ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
                        )}>
                          {row.status === 'Present' ? <CheckCircle className="w-3 h-3" /> : 
                           row.status === 'Late' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.time}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 italic">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Chart */}
          <div className={cn(
            "lg:col-span-4 rounded-[2.5rem] border shadow-sm p-8 flex flex-col",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          )}>
            <h3 className="text-xl font-bold tracking-tight mb-8">
              {language === 'en' ? "Attendance Trends" : "حاضری کے رجحانات"}
            </h3>
            
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-emerald-500">95%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-black">{item.value}%</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                  {language === 'en' ? "Ali's attendance has improved by 5% compared to last month. Keep it up!" : "علی کی حاضری میں گزشتہ ماہ کے مقابلے میں 5 فیصد بہتری آئی ہے۔ اسے جاری رکھیں!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCommunication = () => {
    const messages = [
      { id: 1, sender: 'Ms. Sarah (Math)', text: 'Ali performed very well in today\'s quiz!', time: '10:30 AM', unread: true, avatar: 'S', status: 'Online' },
      { id: 2, sender: 'Mr. Ahmed (Physics)', text: 'Please check the lab report requirements.', time: 'Yesterday', unread: false, avatar: 'A', status: 'Last active: 2h ago' },
      { id: 3, sender: 'Grade 10-A Group', text: 'Reminder: PTM scheduled for Saturday.', time: '2 days ago', unread: false, avatar: 'G', status: 'Group Chat' },
    ];

    const alerts = [
      { id: 1, title: 'Attendance Alert', desc: 'Ali arrived at school at 08:45 AM.', time: 'Today', type: 'attendance', read: false },
      { id: 2, title: 'Homework Reminder', desc: 'Math Exercise 4.2 due tomorrow.', time: 'Today', type: 'homework', read: true },
      { id: 3, title: 'Low Grade Warning', desc: 'Urdu marks are below class average.', time: 'Yesterday', type: 'grade', read: false },
    ];

    const events = [
      { id: 1, title: 'Parent-Teacher Meeting', date: 'Sat, 28 Mar', time: '09:00 AM', location: 'Main Hall', type: 'PTM' },
      { id: 2, title: 'Annual Sports Day', date: 'Wed, 01 Apr', time: '08:00 AM', location: 'School Ground', type: 'Event' },
      { id: 3, title: 'Science Exhibition', date: 'Mon, 06 Apr', time: '10:00 AM', location: 'Lab Wing', type: 'Exhibition' },
    ];

    return (
      <div className={cn(
        "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col",
        isDarkMode ? "dark bg-slate-900 text-white -m-8 p-8 min-h-screen" : ""
      )}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {language === 'en' ? "Unified Communication" : "متحدہ مواصلات"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {language === 'en' ? "Stay connected with teachers, track alerts and school events." : "اساتذہ کے ساتھ جڑے رہیں، الرٹس اور اسکول کے واقعات کو ٹریک کریں۔"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={language === 'en' ? "Search inbox..." : "ان باکس تلاش کریں..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all w-64",
                  isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                )}
              />
            </div>
            <Button 
              variant="outline" 
              className="rounded-xl"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          {[
            { id: 'messages', label: language === 'en' ? 'Messages' : 'پیغامات', icon: MessageSquare, badge: 1 },
            { id: 'alerts', label: language === 'en' ? 'Alerts' : 'الرٹس', icon: Bell, badge: 2 },
            { id: 'events', label: language === 'en' ? 'Events' : 'واقعات', icon: CalendarDays, badge: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCommTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative",
                commTab === tab.id 
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          {/* Main Content Area */}
          <div className={cn(
            "lg:col-span-8 rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          )}>
            {commTab === 'messages' && (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 font-black text-xl">
                      S
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Ms. Sarah (Math)</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow p-8 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/10">
                  <div className="flex justify-center">
                    <span className="px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                  </div>
                  
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs shrink-0">S</div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        Ali performed very well in today's quiz! He got 10/10 in Algebra section.
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 mt-2 block">10:30 AM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="w-8 h-8 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">MK</div>
                    <div className="p-4 bg-brand-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-brand-500/20">
                      <p className="text-sm leading-relaxed font-medium">
                        Thank you Ms. Sarah! We are very happy to hear that.
                      </p>
                      <span className="text-[9px] font-bold text-white/70 mt-2 block text-right">10:35 AM</span>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                  <div className="flex gap-2">
                    {['Thanks!', 'Leave Request', 'Call me back'].map((tmpl) => (
                      <button key={tmpl} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg text-[10px] font-bold transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-800">
                        {tmpl}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Paperclip className="w-5 h-5" /></button>
                    <div className="relative flex-grow">
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? "Type a message..." : "پیغام لکھیں..."}
                        className={cn(
                          "w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all",
                          isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                        )}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Mic className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            )}

            {commTab === 'alerts' && (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight">{language === 'en' ? "Notification History" : "اطلاعات کی تاریخ"}</h3>
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Mark all as read</Button>
                </div>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      "p-5 rounded-3xl border transition-all flex items-start gap-4 hover:shadow-md cursor-pointer group",
                      !alert.read ? "bg-brand-50/50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        alert.type === 'attendance' ? "bg-emerald-100 text-emerald-600" : 
                        alert.type === 'homework' ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                      )}>
                        {alert.type === 'attendance' ? <CheckCircle className="w-6 h-6" /> : 
                         alert.type === 'homework' ? <BookOpen className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{alert.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{alert.desc}</p>
                      </div>
                      {!alert.read && <div className="w-2 h-2 bg-brand-500 rounded-full mt-2" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {commTab === 'events' && (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight">{language === 'en' ? "Upcoming School Events" : "اسکول کے آنے والے واقعات"}</h3>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <CalendarIcon className="w-4 h-4" /> Add to Calendar
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <div key={event.id} className={cn(
                      "p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-all group",
                      isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
                          {event.type}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">{event.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          <Clock className="w-3 h-3" /> {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20">RSVP Now</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Inbox List */}
            <div className={cn(
              "rounded-[2.5rem] border shadow-sm p-6",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            )}>
              <h3 className="text-lg font-black tracking-tight mb-6">{language === 'en' ? "Recent Chats" : "حالیہ چیٹس"}</h3>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-2xl cursor-pointer transition-all group">
                    <div className="relative">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-lg group-hover:bg-brand-500 group-hover:text-white transition-all">
                        {msg.avatar}
                      </div>
                      {msg.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white dark:border-slate-800" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{msg.sender}</h4>
                        <span className="text-[9px] font-bold text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Analytics */}
            <div className={cn(
              "rounded-[2.5rem] border shadow-sm p-8",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Teacher Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold">Ms. Sarah</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Now</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    <span className="text-xs font-bold">Mr. Ahmed</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">2h ago</span>
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand-500/20">
              <h3 className="text-lg font-black tracking-tight mb-4">{language === 'en' ? "Help us improve!" : "ہمیں بہتر بنانے میں مدد کریں!"}</h3>
              <p className="text-xs text-brand-100 mb-6 font-medium leading-relaxed">Your feedback helps us make school communication better for everyone.</p>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <Star className="w-5 h-5 text-brand-200 fill-brand-200/20" />
                  </button>
                ))}
              </div>
              <Button className="w-full bg-white text-brand-600 hover:bg-brand-50 rounded-2xl font-bold">Submit Feedback</Button>
            </div>
          </div>
        </div>

        {/* Floating Compose Button */}
        <button className="fixed bottom-10 right-10 w-16 h-16 bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    );
  };

  const renderFees = () => {
    const feeHistory = fees.filter(f => f.status === 'Paid').map(f => ({
      id: f.id,
      month: f.month || 'Current',
      amount: f.amount?.toLocaleString() || '0',
      status: 'Paid',
      date: f.paymentDate?.toDate()?.toLocaleDateString() || 'Recently',
      method: f.paymentMethod || 'Online'
    }));

    const pendingFees = fees.filter(f => f.status !== 'Paid').map(f => ({
      id: f.id,
      month: f.month || 'Current',
      type: f.type || 'Tuition Fee',
      amount: f.amount || 0,
      dueDate: f.dueDate || '10th of Month',
      lateFee: f.lateFee || 500
    }));

    const paymentGateways = [
      { id: 'jazzcash', name: 'JazzCash', icon: Wallet, color: 'bg-red-600', description: 'Pay via JazzCash Wallet or Mobile Account' },
      { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone, color: 'bg-emerald-500', description: 'Instant payment via EasyPaisa App' },
      { id: 'hbl', name: 'HBL Konnect', icon: Building2, color: 'bg-emerald-700', description: 'Direct Bank Transfer / 1BILL' },
      { id: 'meezan', name: 'Meezan Bank', icon: Building2, color: 'bg-emerald-900', description: 'Islamic Banking IBFT' },
      { id: 'ubl', name: 'UBL Digital', icon: Building2, color: 'bg-blue-700', description: 'UBL Omni & Digital Payments' },
    ];

    const handlePayment = async () => {
      try {
        if (!selectedFee?.id) return;
        
        // Update Firestore status
        const feeRef = doc(db, 'fees', selectedFee.id);
        await updateDoc(feeRef, {
          status: 'Paid',
          paymentDate: serverTimestamp(),
          paymentMethod: paymentMethod
        });

        setPaymentStep('success');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `fees/${selectedFee.id}`);
      }
    };

    const downloadReceipt = async () => {
      const element = document.getElementById('receipt-content');
      if (!element) return;
      
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${selectedFee.id}.pdf`);
    };

    if (paymentStep === 'success') {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
          <div id="receipt-content" className="hidden">
            <div className="p-10 bg-white text-slate-900 w-[800px]">
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-brand-600">LMS PARENTS PORTAL</h1>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Official Fee Receipt</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">Receipt #: {Math.floor(Math.random() * 1000000)}</div>
                  <div className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Student Details</h4>
                  <p className="font-bold">Ali Khan</p>
                  <p className="text-sm text-slate-500">Grade 8-A • Roll # 24</p>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Payment Method</h4>
                  <p className="font-bold uppercase">{paymentMethod}</p>
                  <p className="text-sm text-slate-500">Status: SUCCESSFUL</p>
                </div>
              </div>
              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 text-left text-xs font-bold text-slate-400 uppercase">Description</th>
                    <th className="py-4 text-right text-xs font-bold text-slate-400 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-4 font-medium">{selectedFee.type} - {selectedFee.month}</td>
                    <td className="py-4 text-right font-bold">PKR {selectedFee.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium">Transaction Fee (1.5%)</td>
                    <td className="py-4 text-right font-bold">PKR {(selectedFee.amount * 0.015).toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900">
                    <td className="py-6 text-xl font-black">Total Paid</td>
                    <td className="py-6 text-right text-2xl font-black text-brand-600">PKR {(selectedFee.amount * 1.015).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">This is a computer-generated receipt and does not require a physical signature.</p>
              </div>
            </div>
          </div>

          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
            <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Payment Successful!</h2>
          <p className="text-slate-500 max-w-md mb-8 font-medium">
            Your payment of PKR {selectedFee?.amount?.toLocaleString()} has been processed. An instant receipt has been sent to your email and WhatsApp.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" className="gap-2 px-8" onClick={downloadReceipt}>
              <Download className="w-4 h-4" /> Download Receipt
            </Button>
            <Button variant="outline" onClick={() => setPaymentStep('dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    if (paymentStep === 'checkout') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setPaymentStep('dashboard')} className="p-2 rounded-full">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </Button>
            <h2 className="text-3xl font-black text-slate-900">Checkout</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentGateways.map((gw) => (
                    <button
                      key={gw.id}
                      onClick={() => setPaymentMethod(gw.id)}
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                        paymentMethod === gw.id 
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20" 
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", gw.color)}>
                        <gw.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{gw.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{gw.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Payment Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Fee Amount</span>
                    <span className="font-bold text-slate-900">PKR {selectedFee.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Transaction Fee (1.5%)</span>
                    <span className="font-bold text-slate-900">PKR {(selectedFee.amount * 0.015).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-6 bg-brand-600 rounded-2xl text-white shadow-lg shadow-brand-500/20">
                    <span className="font-bold text-xl">Total Amount</span>
                    <span className="font-black text-2xl">PKR {(selectedFee.amount * 1.015).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <QrCode className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-bold mb-6 relative z-10">Scan to Pay</h3>
                <div className="bg-white p-4 rounded-3xl mb-6 flex items-center justify-center shadow-2xl">
                  <QrCode className="w-48 h-48 text-slate-900" />
                </div>
                <p className="text-xs text-slate-400 text-center font-medium leading-relaxed">
                  Scan this QR code using your {paymentMethod || 'Banking'} app to complete the payment instantly.
                </p>
              </div>
              <Button 
                variant="primary" 
                className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-brand-500/20"
                disabled={!paymentMethod}
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Fees & <span className="text-brand-500">Payments</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Manage your child's tuition fees and download receipts.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <HistoryIcon className="w-4 h-4" /> Payment History
            </Button>
            <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
              <Download className="w-4 h-4" /> Fee Structure
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pending Fees */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Pending Invoices</h3>
              <div className="space-y-4">
                {pendingFees.map((fee) => (
                  <div key={fee.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-200 transition-all">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                        <Banknote className="w-7 h-7 text-brand-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{fee.type} - {fee.month}</div>
                        <div className="text-xs text-slate-500 font-medium">Due Date: {fee.dueDate}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[8px] font-bold uppercase tracking-wider">Unpaid</span>
                          {fee.lateFee > 0 && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[8px] font-bold uppercase tracking-wider">Late Fine: PKR {fee.lateFee}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">PKR {fee.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Payable</div>
                      </div>
                      <Button 
                        variant="primary" 
                        className="rounded-xl px-8 group-hover:scale-105 transition-transform"
                        onClick={() => {
                          setSelectedFee(fee);
                          setPaymentStep('checkout');
                        }}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Month</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Method</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.month}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900">PKR {row.amount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.method}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase">Paid</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar: Payment Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold leading-tight">Instant Digital<br/>Receipts</h3>
              </div>
              <p className="text-sm text-brand-100 mb-8 font-medium leading-relaxed">
                All payments are processed securely via encrypted gateways. Get instant PDF receipts and SMS confirmations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Secure SSL Encryption
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> 24/7 Payment Support
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Automated Reminders
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Supported Banks</h3>
              <div className="grid grid-cols-3 gap-4 opacity-60">
                {['HBL', 'UBL', 'Meezan', 'Alfalah', 'MCB', 'Allied'].map((bank) => (
                  <div key={bank} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">
                    {bank}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                  Support for 1BILL and Raast IBFT allows you to pay from any Pakistani bank account instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const exportProgressPDF = async () => {
    if (!guidanceRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(guidanceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${children[selectedChild].name}_Progress_Report.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderGuidance = () => {
    const child = children[selectedChild];
    
    const performanceData = [
      { subject: 'Math', grade: 'A', score: 92 },
      { subject: 'Physics', grade: 'B+', score: 85 },
      { subject: 'English', grade: 'A-', score: 88 },
      { subject: 'Urdu', grade: 'A', score: 90 },
      { subject: 'Computer', grade: 'A+', score: 96 },
    ];

    const gpaData = [
      { month: 'Sep', gpa: 3.2 },
      { month: 'Oct', gpa: 3.4 },
      { month: 'Nov', gpa: 3.5 },
      { month: 'Dec', gpa: 3.3 },
      { month: 'Jan', gpa: 3.6 },
      { month: 'Feb', gpa: 3.8 },
    ];

    const homework = [
      { id: 1, subject: 'Math', title: 'Calculus Exercise 4.2', deadline: 'Tomorrow', status: 'Pending' },
      { id: 2, subject: 'Physics', title: 'Lab Report: Optics', deadline: '28 Mar', status: 'In Progress' },
      { id: 3, subject: 'English', title: 'Essay: Climate Change', deadline: '30 Mar', status: 'Assigned' },
    ];

    const diaryEntries = [
      { id: 1, date: '24 Mar', teacher: 'Ms. Sarah', message: 'Ali was very active in the math discussion today. Well done!', type: 'Remark' },
      { id: 2, date: '22 Mar', teacher: 'Mr. Ahmed', message: 'Please ensure the physics lab coat is brought for tomorrow\'s practical.', type: 'Notice' },
    ];

    const upcomingEvents = [
      { id: 1, title: 'Parent-Teacher Meeting', date: '28 Mar', time: '10:00 AM', type: 'PTM' },
      { id: 2, title: 'Final Term Exams', date: '15 Apr', time: '08:30 AM', type: 'Exam' },
    ];

    const staff = [
      { name: 'Ms. Sarah', role: 'Class Teacher / Math', contact: '+92 300 1234567' },
      { name: 'Mr. Ahmed', role: 'Physics Specialist', contact: '+92 300 7654321' },
    ];

    const attendanceTrend = [
      { month: 'Sep', present: 22, absent: 2 },
      { month: 'Oct', present: 24, absent: 0 },
      { month: 'Nov', present: 20, absent: 4 },
      { month: 'Dec', present: 18, absent: 6 },
      { month: 'Jan', present: 25, absent: 1 },
      { month: 'Feb', present: 23, absent: 1 },
    ];

    return (
      <div 
        ref={guidanceRef}
        className={cn(
          "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
          isDarkMode ? "dark bg-slate-900 text-white -m-8 p-8 min-h-screen" : ""
        )}
      >
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Multi-child Switcher */}
          <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl w-fit backdrop-blur-md border border-white/20">
            {children.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedChild(idx)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2",
                  selectedChild === idx 
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700"
                )}
              >
                <Baby className="w-4 h-4" />
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowCustomize(true)}
              variant="outline" 
              className="rounded-2xl font-bold bg-white/50 dark:bg-slate-800/50 border-white/20 backdrop-blur-md"
            >
              <Settings className="w-4 h-4 mr-2" />
              Customize Dashboard
            </Button>
            <Button 
              onClick={exportProgressPDF}
              disabled={isExporting}
              className="bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30"
            >
              {isExporting ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>

        {/* Live Class Banner */}
        {isLive && (
          <div className="bg-rose-500 text-white p-4 rounded-3xl flex items-center justify-between shadow-lg shadow-rose-500/20 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
              <span className="font-bold">Live Class Active: Advanced Mathematics (Calculus)</span>
            </div>
            <Button className="bg-white text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs">
              Join as Observer
            </Button>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 p-10 text-white shadow-2xl shadow-brand-500/20">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-4 border-white/30 shadow-2xl transition-transform group-hover:scale-105">
                <img src={child.photo} alt={child.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-brand-600 rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl font-black tracking-tight">{child.name}</h1>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/10">
                  Class {child.class} • Roll #{child.roll}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Attendance', value: '94%', icon: CalendarDays, color: 'text-emerald-300' },
                  { label: 'Avg Grade', value: 'A', icon: GraduationCap, color: 'text-amber-300' },
                  { label: 'Fees Due', value: 'Rs. 12,500', icon: Wallet, color: 'text-rose-300' },
                  { label: 'Rank', value: '4th', icon: Trophy, color: 'text-blue-300' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-100 text-xs font-bold">
                <Activity className="w-4 h-4 animate-pulse" />
                Real-time Sync Active
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Overview */}
            {visibleWidgets.academic && (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Academic Overview</h2>
                    <p className="text-slate-500 text-sm">Detailed subject performance and trends</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold">
                      Term 2 (2025-26)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-64">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">GPA Trend</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gpaData}>
                        <defs>
                          <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0066cc" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="gpa" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-64">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Subject Distribution</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="score"
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-4">Subject</th>
                        <th className="pb-4">Grade</th>
                        <th className="pb-4">Score</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      {performanceData.map((item, i) => (
                        <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 font-bold text-slate-700 dark:text-slate-300">{item.subject}</td>
                          <td className="py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-xs font-black",
                              item.grade.startsWith('A') ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {item.grade}
                            </span>
                          </td>
                          <td className="py-4 font-mono font-bold text-slate-600 dark:text-slate-400">{item.score}%</td>
                          <td className="py-4">
                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500" style={{ width: `${item.score}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Attendance & Diary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleWidgets.attendance && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Attendance History</h3>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                    </div>
                  </div>
                  
                  <div className="h-48 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, i) => {
                      const status = i % 10 === 0 ? 'absent' : (i % 7 === 0 ? 'late' : 'present');
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:scale-110 cursor-pointer",
                            status === 'present' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : 
                            status === 'absent' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20" : 
                            "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                          )}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {visibleWidgets.diary && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Teacher Remarks</h3>
                  <div className="space-y-6">
                    {diaryEntries.map(entry => (
                      <div key={entry.id} className="relative pl-6 border-l-2 border-brand-200 dark:border-brand-800">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-slate-800" />
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-brand-600">{entry.teacher}</span>
                          <span className="text-[10px] font-bold text-slate-400">{entry.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{entry.message}</p>
                        <button 
                          onClick={() => setReplyModal({ isOpen: true, teacher: entry.teacher })}
                          className="flex items-center gap-2 text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                          Reply to Teacher
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-2xl font-bold">
                    View All Diary Entries
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* AI Insights */}
            {visibleWidgets.ai && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Cpu className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-300" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Focus Area</p>
                    <p className="text-sm font-medium">Improvement needed in <span className="font-black text-amber-300">Math (Calculus)</span>. Consider extra practice sessions.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Strength</p>
                    <p className="text-sm font-medium">Excellent performance in <span className="font-black text-emerald-300">Computer Science</span>. Potential for advanced projects.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Parent Tip</p>
                    <p className="text-sm font-medium">Encourage reading Urdu literature to improve vocabulary and expression.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fees & Payments */}
            {visibleWidgets.fees && (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Fees & Dues</h3>
                <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-3xl border border-rose-100 dark:border-rose-800/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Pending Dues</div>
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">Rs. 12,500</div>
                  <p className="text-[10px] font-bold text-rose-500 uppercase">Due by 10 Mar 2026</p>
                  <Button 
                    onClick={() => setActiveTab('fees')}
                    className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/30"
                  >
                    Pay Now
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">Feb 2026 Fee</div>
                        <div className="text-[10px] text-slate-500">Paid on 05 Feb</div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-700 dark:text-slate-300">Rs. 12,500</div>
                  </div>
                </div>
              </div>
            )}

            {/* Events & Notices */}
            {visibleWidgets.events && (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Events & Notices</h3>
                <div className="space-y-6">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex gap-4">
                      <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/30 rounded-2xl flex flex-col items-center justify-center text-brand-600 shrink-0">
                        <span className="text-[10px] font-black uppercase">{event.date.split(' ')[1]}</span>
                        <span className="text-xl font-black">{event.date.split(' ')[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">{event.title}</div>
                        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <span className={cn(
                          "inline-block mt-2 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                          event.type === 'PTM' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Staff Directory</h4>
                  <div className="space-y-4">
                    {staff.map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                            {s.name.split(' ')[1][0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-white">{s.name}</div>
                            <div className="text-[10px] text-slate-500">{s.role}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-lg flex items-center justify-center hover:bg-brand-100 transition-colors">
                            <Smartphone className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customize Modal */}
        {showCustomize && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Customize Dashboard</h3>
                <button onClick={() => setShowCustomize(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                {Object.entries(visibleWidgets).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                    <span className="font-bold capitalize text-slate-700 dark:text-slate-300">{key} Widget</span>
                    <button 
                      onClick={() => setVisibleWidgets(prev => ({ ...prev, [key]: !value }))}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        value ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        value ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowCustomize(false)}
                className="w-full mt-8 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold py-6 shadow-lg shadow-brand-500/30"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {replyModal?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Reply to {replyModal.teacher}</h3>
                <button 
                  onClick={() => setReplyModal(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <textarea 
                placeholder="Type your reply here..."
                className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none text-slate-700 dark:text-slate-300"
              />
              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={() => setReplyModal(null)}
                  variant="outline" 
                  className="flex-1 rounded-2xl font-bold py-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setReplyModal(null)}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold py-6 shadow-lg shadow-brand-500/30"
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTracking = () => {
    const busInfo = {
      id: 'Bus #14',
      driver: 'Muhammad Ali',
      contact: '+92 300 9876543',
      status: 'On Route',
      eta: '5 mins',
      currentLocation: 'Main Market, Gulberg',
      route: ['School', 'Liberty', 'Main Market', 'Home'],
      stops: [
        { name: 'School', time: '02:30 PM', completed: true },
        { name: 'Liberty', time: '02:45 PM', completed: true },
        { name: 'Main Market', time: '02:55 PM', completed: false },
        { name: 'Home', time: '03:05 PM', completed: false },
      ]
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Bus <span className="text-brand-500">Tracking</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Real-time location and route status of your child's school bus.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Smartphone className="w-4 h-4" /> Call Driver
            </Button>
            <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
              <Bell className="w-4 h-4" /> Notify Me
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map View */}
          <div className="lg:col-span-8">
            <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm h-[500px] relative overflow-hidden">
              {/* Simulated Map */}
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Grid lines to simulate map */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
                    {Array.from({ length: 144 }).map((_, i) => (
                      <div key={i} className="border border-slate-300" />
                    ))}
                  </div>
                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path 
                      d="M 100 100 L 300 150 L 500 120 L 700 300" 
                      stroke="#0066cc" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray="8 8"
                      className="animate-[dash_20s_linear_infinite]"
                    />
                  </svg>
                  {/* Bus Marker */}
                  <div className="absolute top-[120px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-brand-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg mb-2 whitespace-nowrap">
                      {busInfo.id} - {busInfo.eta} away
                    </div>
                    <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* Home Marker */}
                  <div className="absolute top-[300px] left-[700px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <School className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 mt-2">Home</div>
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:text-brand-500 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:text-brand-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bus Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{busInfo.id}</h3>
                  <p className="text-xs text-slate-500 font-medium">Status: <span className="text-emerald-500 font-bold">{busInfo.status}</span></p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">Driver</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{busInfo.driver}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">ETA</span>
                  </div>
                  <span className="text-sm font-black text-brand-600">{busInfo.eta}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Route Progress</h4>
                <div className="space-y-6">
                  {busInfo.stops.map((stop, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      {i !== busInfo.stops.length - 1 && (
                        <div className={cn(
                          "absolute left-[7px] top-4 w-0.5 h-10",
                          stop.completed ? "bg-brand-500" : "bg-slate-200"
                        )} />
                      )}
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 mt-1 shrink-0",
                        stop.completed ? "bg-brand-500 border-brand-500" : "bg-white border-slate-300"
                      )}>
                        {stop.completed && <CheckCircle className="w-3 h-3 text-white m-auto" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span className={cn(
                            "text-sm font-bold",
                            stop.completed ? "text-slate-900" : "text-slate-400"
                          )}>{stop.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">{stop.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-500/20">
              <h3 className="text-lg font-bold mb-4">Safety First</h3>
              <p className="text-xs text-brand-100 mb-6 font-medium leading-relaxed">
                Our buses are equipped with GPS tracking and speed monitors. You will receive an alert if the bus is delayed or arrives at your stop.
              </p>
              <div className="flex items-center gap-3 text-xs font-bold">
                <Shield className="w-5 h-5 text-emerald-400" /> Verified Driver & Attendant
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomework = () => {
    const homeworkList = [
      { id: 1, subject: 'Mathematics', title: 'Calculus Exercise 4.2', status: 'Pending', deadline: 'Tomorrow', description: 'Solve questions 1-15 from the textbook.' },
      { id: 2, subject: 'Physics', title: 'Lab Report: Optics', status: 'Submitted', deadline: '24 Mar 2026', description: 'Complete the lab report on light reflection experiment.' },
      { id: 3, subject: 'English', title: 'Essay: Climate Change', status: 'Pending', deadline: '28 Mar 2026', description: 'Write a 500-word essay on the impact of global warming.' },
      { id: 4, subject: 'Computer Science', title: 'Python Project', status: 'In Progress', deadline: '02 Apr 2026', description: 'Develop a simple calculator using Python.' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Daily <span className="text-brand-500">Homework</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Track assignments, deadlines, and submission status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <HistoryIcon className="w-4 h-4" /> Past Assignments
            </Button>
            <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
              <Plus className="w-4 h-4" /> Submit Homework
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {homeworkList.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-brand-200 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100 shadow-inner">
                      <BookOpen className="w-8 h-8 text-brand-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-slate-900">{item.subject}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          item.status === 'Submitted' ? "bg-emerald-100 text-emerald-600" : 
                          item.status === 'In Progress' ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-600">{item.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Deadline</div>
                    <div className="text-sm font-black text-slate-900 flex items-center justify-end gap-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {item.deadline}
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest">View Details</Button>
                  {item.status !== 'Submitted' && (
                    <Button variant="primary" size="sm" className="rounded-xl px-6 shadow-md shadow-brand-500/20">Upload Solution</Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Homework Stats</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Completion Rate</span>
                  <span className="text-sm font-black text-emerald-500">85%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <div className="text-2xl font-black text-blue-600">12</div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase">Submitted</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <div className="text-2xl font-black text-orange-600">02</div>
                    <div className="text-[10px] font-bold text-orange-400 uppercase">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-bold mb-4">AI Study Plan</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">
                Based on Ali's recent performance, AI recommends focusing on "Calculus" tonight. We've prepared a 30-min revision guide.
              </p>
              <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold">View Guide</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    const documents = [
      { id: 1, name: 'Report Card - Term 1', type: 'PDF', size: '1.2 MB', date: '15 Jan 2026' },
      { id: 2, name: 'Fee Structure 2025-26', type: 'PDF', size: '0.8 MB', date: '01 Sep 2025' },
      { id: 3, name: 'School Calendar', type: 'PDF', size: '2.4 MB', date: '20 Aug 2025' },
      { id: 4, name: 'Medical Form', type: 'DOCX', size: '0.3 MB', date: '10 Aug 2025' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              School <span className="text-brand-500">Documents</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Access and download important school documents and certificates.</p>
          </div>
          <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</h3>
                  <p className="text-[10px] text-slate-500 font-medium">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.date}</span>
                <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Document Vault</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            All documents are encrypted and stored securely. Only authorized parents and school staff can access these files.
          </p>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Account <span className="text-brand-500">Settings</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Manage your profile, notifications, and security preferences.</p>
        </div>
        <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-brand-500/20">
          <CheckCircle className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" defaultValue="Mehar Khan" className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" defaultValue="kanwalmehar301@gmail.com" className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                <input type="tel" defaultValue="+92 300 1234567" className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</label>
                <input type="text" defaultValue="Gulberg III, Lahore" className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'WhatsApp Alerts', desc: 'Receive real-time updates on WhatsApp', enabled: true },
                { label: 'Email Notifications', desc: 'Monthly reports and newsletters', enabled: true },
                { label: 'SMS Alerts', desc: 'Emergency notices and fee reminders', enabled: false },
                { label: 'App Push Notifications', desc: 'Homework and attendance alerts', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{pref.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{pref.desc}</div>
                  </div>
                  <button className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    pref.enabled ? "bg-brand-500" : "bg-slate-300"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      pref.enabled ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
            <h3 className="text-xl font-bold mb-6">Security</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl font-bold gap-2">
                <Key className="w-4 h-4" /> Change Password
              </Button>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl font-bold gap-2">
                <Shield className="w-4 h-4" /> Two-Factor Auth
              </Button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Language Settings</h3>
            <div className="flex gap-2">
              <Button variant={language === 'en' ? 'primary' : 'outline'} className="flex-1 rounded-xl">English</Button>
              <Button variant={language === 'ur' ? 'primary' : 'outline'} className="flex-1 rounded-xl">اردو</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.performance}</h2>
          <p className="text-sm text-slate-500">Detailed academic reports and progress analysis</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Download Report Card
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Subject-wise Marks</h3>
          <div className="space-y-6">
            {[
              { subject: 'Mathematics', marks: 88, total: 100, color: 'bg-blue-500' },
              { subject: 'Physics', marks: 76, total: 100, color: 'bg-green-500' },
              { subject: 'Computer Science', marks: 92, total: 100, color: 'bg-purple-500' },
              { subject: 'English', marks: 84, total: 100, color: 'bg-orange-500' },
              { subject: 'Urdu', marks: 70, total: 100, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">{item.subject}</span>
                  <span className="font-bold text-slate-900">{item.marks}/{item.total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${item.marks}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">{t.weakSubjects}</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="text-xs font-bold text-red-900">Urdu</div>
                <div className="text-[10px] text-red-700 mt-1">Focus on grammar and essay writing. Current score is 15% below class average.</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="text-xs font-bold text-orange-900">Physics</div>
                <div className="text-[10px] text-orange-700 mt-1">Practical work is good, but theory needs more attention.</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Teacher Remarks</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Ms. Sarah (Math)</div>
                  <div className="text-[10px] text-slate-500 italic mt-1">"Ali is very attentive in class but needs to practice more at home."</div>
                </div>
              </div>
            </div>
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
            <Baby className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display">Parent LMS</span>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)] custom-scrollbar">
          {[
            { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
            { id: 'performance', label: t.performance, icon: BarChart3 },
            { id: 'attendance', label: t.attendance, icon: CalendarIcon },
            { id: 'homework', label: t.homework, icon: BookOpen },
            { id: 'communication', label: t.communication, icon: MessageSquare },
            { id: 'fees', label: t.fees, icon: CreditCard },
            { id: 'tracking', label: t.tracking, icon: MapPin },
            { id: 'guidance', label: t.guidance, icon: Cpu },
            { id: 'documents', label: t.documents, icon: FileText },
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
            <h1 className="text-xl font-bold text-slate-800">{t.welcome}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Mehar Khan</div>
                <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Parent</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                MK
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'communication' && renderCommunication()}
          {activeTab === 'fees' && renderFees()}
          {activeTab === 'guidance' && renderGuidance()}
          {activeTab === 'homework' && renderHomework()}
          {activeTab === 'tracking' && renderTracking()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'none' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Module Under Development</h2>
              <p className="text-slate-500 max-w-md">The {activeTab} module is currently being optimized for the best parent experience.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
