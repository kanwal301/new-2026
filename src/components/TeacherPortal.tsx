import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileEdit, 
  ClipboardCheck, 
  Users, 
  Calendar, 
  MessageSquare, 
  Library, 
  Bell, 
  Cpu, 
  Smartphone, 
  LogOut,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  FileText,
  Download,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  User,
  Settings,
  GraduationCap,
  PlayCircle,
  Monitor,
  Target,
  Brain,
  Lock,
  UserCheck,
  BarChart3,
  Eye,
  XCircle,
  Zap,
  Link as LinkIcon,
  Mail,
  Wallet,
  Banknote,
  Receipt
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
  Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { db, OperationType, handleFirestoreError } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../App';

interface TeacherPortalProps {
  onLogout: () => void;
  language: 'en' | 'ur';
}

const COLORS = ['#0066cc', '#28a745', '#ffc107', '#fd7e14', '#dc3545'];

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onLogout, language }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'courses'), where('teacherId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
      setLoadingCourses(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courses');
    });
    
    return unsubscribe;
  }, [user]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const isRtl = language === 'ur';

  const handleCreateCourse = async (courseData: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'courses'), {
        ...courseData,
        teacherId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'courses');
    }
  };

  const t = {
    en: {
      dashboard: 'Dashboard',
      courses: 'Courses',
      liveClass: 'Live Class',
      assignments: 'Assignments',
      grading: 'Smart Checking',
      students: 'Student Tracking',
      attendance: 'Attendance',
      communication: 'Communication',
      guidance: 'Student Guidance',
      library: 'Resource Library',
      aiAssistant: 'AI Assistant',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome, Teacher',
      todayClasses: "Today's Classes",
      pendingAssignments: 'Pending Assignments',
      studentAlerts: 'Student Alerts',
      quickActions: 'Quick Actions',
      startClass: 'Start Class',
      uploadContent: 'Upload Content',
      checkWork: 'Check Work',
      aiGenerate: 'Generate with AI',
      aiPlaceholder: 'Ask AI to generate a quiz, lesson summary, or paper...',
      sendToAll: 'Send to All Students',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      courses: 'کورسز',
      liveClass: 'لائیو کلاس',
      assignments: 'اسائنمنٹس',
      grading: 'سمارٹ چیکنگ',
      students: 'طلباء کی ٹریکنگ',
      attendance: 'حاضری',
      communication: 'مواصلات',
      guidance: 'طلباء کی رہنمائی',
      library: 'وسائل کی لائبریری',
      aiAssistant: 'AI اسسٹنٹ',
      settings: 'ترتیبات',
      logout: 'لاگ آؤٹ',
      welcome: 'خوش آمدید، ٹیچر',
      todayClasses: 'آج کی کلاسیں',
      pendingAssignments: 'زیر التواء اسائنمنٹس',
      studentAlerts: 'طلباء کے الرٹس',
      quickActions: 'فوری اقدامات',
      startClass: 'کلاس شروع کریں',
      uploadContent: 'مواد اپ لوڈ کریں',
      checkWork: 'کام چیک کریں',
      aiGenerate: 'AI کے ساتھ بنائیں',
      aiPlaceholder: 'AI سے کوئز، سبق کا خلاصہ، یا پیپر بنانے کا کہیں...',
      sendToAll: 'تمام طلباء کو بھیجیں',
    }
  }[language];

  const handleAiAction = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ parts: [{ text: `You are an expert educational AI assistant. Based on the following request from a teacher, generate high-quality educational content (like a quiz, lesson plan, or exam paper) in ${language === 'en' ? 'English' : 'Urdu'}. Request: ${aiPrompt}` }] }],
      });
      setAiResponse(response.text || 'No response generated.');
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Error generating content. Please check your API key.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.todayClasses, value: '4', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: t.pendingAssignments, value: '28', icon: FileEdit, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: t.studentAlerts, value: '3', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Fee Defaulters', value: '12', icon: Wallet, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">{t.todayClasses}</h3>
            <Button variant="outline" size="sm" className="text-xs">Full Schedule</Button>
          </div>
          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <Clock className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.class || 'Grade 10-A'} • 09:00 AM - 10:00 AM</div>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" className="text-xs px-4">
                    {t.startClass}
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">{t.quickActions}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                <Video className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-blue-700 uppercase">{t.startClass}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                <Plus className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-green-700 uppercase">{t.uploadContent}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
                <ClipboardCheck className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-purple-700 uppercase">{t.checkWork}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
                <MessageSquare className="w-6 h-6 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-orange-700 uppercase">Chat</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Fee Payment Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Ali Khan', status: 'Paid', amount: '12,500' },
                { name: 'Sara Ahmed', status: 'Pending', amount: '12,500' },
                { name: 'Zaid Malik', status: 'Overdue', amount: '12,500' },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{student.name}</div>
                    <div className="text-[10px] text-slate-500">PKR {student.amount}</div>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase",
                    student.status === 'Paid' ? "bg-emerald-100 text-emerald-600" : 
                    student.status === 'Pending' ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
                  )}>{student.status}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-[10px] text-brand-500">View All Payments</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-brand-500" />
            {t.aiAssistant}
          </h2>
          <p className="text-sm text-slate-500">Generate quizzes, lesson summaries, and exam papers instantly</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <BrainCircuit className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t.aiPlaceholder}
            className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAiPrompt('Generate a 10-question MCQ quiz for Grade 10 Physics on Newton Laws.')}>
                Physics Quiz
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAiPrompt('Create a summary for a lesson on the Mughal Empire for Grade 8.')}>
                History Summary
              </Button>
            </div>
            <Button 
              variant="primary" 
              className="gap-2 px-8 py-6 rounded-2xl shadow-lg shadow-brand-500/20"
              onClick={handleAiAction}
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {t.aiGenerate}
            </Button>
          </div>
        </div>
      </div>

      {aiResponse && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Generated Content
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="primary" size="sm" className="gap-2">
                <Send className="w-4 h-4" /> {t.sendToAll}
              </Button>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 whitespace-pre-wrap text-slate-700 font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );

  const renderLiveClasses = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Live Class <span className="text-brand-500">Integration</span> Engine
          </h2>
          <p className="text-slate-500 mt-2 font-medium">One-click Zoom & Google Meet connectivity with automated scheduling.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Class
          </Button>
          <Button variant="primary" className="gap-2 bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/20">
            <Video className="w-4 h-4" />
            Start Instant Class
          </Button>
        </div>
      </div>

      {/* Live Class Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: '12', icon: Video, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Total Students Live', value: '458', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Avg. Engagement', value: '88%', icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Recordings Saved', value: '1,240', icon: PlayCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Teacher Dashboard: One-Click Start */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Video className="w-48 h-48 text-brand-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">One-Click Class Start</h3>
                  <p className="text-xs text-slate-500 font-medium">Meeting auto-create + link generation + student alerts.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Google_Meet_icon_%282020%29.svg" alt="Google Meet" className="w-6 h-6" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Connected</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Google Meet Integration</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Auto-generate secure meeting links directly in your Google Calendar.</p>
                  <Button variant="primary" className="w-full text-xs py-3 rounded-xl bg-green-600 hover:bg-green-700 border-none">Start Google Meet</Button>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg" alt="Zoom" className="w-12 h-4" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Active</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Zoom Pro Integration</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4">High-definition video with cloud recording and breakout rooms.</p>
                  <Button variant="primary" className="w-full text-xs py-3 rounded-xl bg-blue-600 hover:bg-blue-700 border-none">Start Zoom Class</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Class Scheduling */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Smart Class Scheduling</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Automated notifications & AI reminders for students.</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Schedule New
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { subject: 'Advanced Mathematics', class: 'Grade 10-A', date: 'Tomorrow, 10:00 AM', students: 42, status: 'Scheduled' },
                { subject: 'Physics - Quantum Mechanics', class: 'Grade 11-B', date: '25 Mar, 02:00 PM', students: 38, status: 'Scheduled' },
                { subject: 'Computer Science - AI', class: 'Grade 9-C', date: '26 Mar, 11:30 AM', students: 55, status: 'Scheduled' },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/5 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{session.date.split(',')[0]}</span>
                    <span className="text-lg font-black text-brand-500">{session.date.split(',')[1].split(' ')[0]}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{session.subject}</h4>
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[8px] font-bold rounded-full uppercase tracking-wider">{session.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <User className="w-3 h-3" />
                        {session.class}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <Users className="w-3 h-3" />
                        {session.students} Students
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Bell className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors"><Settings className="w-5 h-5" /></button>
                    <Button variant="primary" size="sm" className="rounded-xl text-[10px] font-bold uppercase tracking-widest">Join Class</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Automation & Insights */}
        <div className="lg:col-span-4 space-y-8">
          {/* Automation Engine */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32 text-brand-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold tracking-tight leading-none">Automation<br/><span className="text-brand-400">Engine Core</span></h3>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Auto-Notification", desc: "Sends alerts to all students instantly.", icon: Bell },
                  { title: "AI Smart Reminders", desc: "1 day, 1 hour, 10 min before class.", icon: Brain },
                  { title: "Secure Link Gen", desc: "Unique encrypted meeting links.", icon: Lock },
                  { title: "Auto-Attendance", desc: "Mark present upon joining class.", icon: UserCheck },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-white">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">System Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase">Active</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed italic">"Teacher sets time, AI handles everything else automatically."</p>
              </div>
            </div>
          </div>

          {/* AI Class Insights */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Class Insights</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Student Engagement</span>
                  <span className="text-brand-500">88%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-[88%] rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Attendance Rate</span>
                  <span className="text-green-500">94%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[94%] rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-bold text-purple-600 uppercase">AI Recommendation</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">Engagement peaks during interactive Q&A sessions. Suggesting more live polls for tomorrow's class.</p>
              </div>
            </div>
          </div>

          {/* Recording & Playback */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Recordings</h3>
              <button className="text-[10px] font-bold text-brand-500 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Math - Algebra Basics', date: 'Today', duration: '45m', views: 124 },
                { title: 'Physics - Newton Laws', date: 'Yesterday', duration: '52m', views: 98 },
              ].map((rec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{rec.title}</h4>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium">
                      <span>{rec.date}</span>
                      <span>•</span>
                      <span>{rec.duration}</span>
                      <span>•</span>
                      <span>{rec.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRO Live Class Features Summary */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Video className="w-64 h-64 text-brand-500 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">PRO Live Class System</h3>
              <p className="text-slate-400 text-sm font-medium">13-Layer Advanced Virtual Classroom & Automation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "1. Live Class Integration Engine", desc: "Native Zoom & Google Meet integration for seamless connectivity.", icon: LinkIcon },
              { title: "2. One-Click Class Start", desc: "Teacher starts class with one click; system handles the rest.", icon: Monitor },
              { title: "3. Smart Class Scheduling", desc: "Intelligent calendar system for managing dates, times, and subjects.", icon: Calendar },
              { title: "4. Automated Notification System", desc: "Instant alerts to students via app and email upon scheduling.", icon: Bell },
              { title: "5. AI Smart Reminder System", desc: "Multi-stage reminders (1 day, 1 hour, 10 min) to boost attendance.", icon: Brain },
              { title: "6. Multi-Channel Notification", desc: "Reach students anywhere via App, Email, and SMS notifications.", icon: Mail },
              { title: "7. Secure Meeting Link Generator", desc: "Unique, encrypted links to prevent unauthorized access.", icon: Lock },
              { title: "8. Student Live Class Dashboard", desc: "Dedicated view for students to join upcoming live sessions.", icon: GraduationCap },
              { title: "9. Attendance Integration", desc: "Auto-mark attendance the moment a student joins the live class.", icon: UserCheck },
              { title: "10. Recording & Playback", desc: "Cloud recording with instant playback for student revision.", icon: PlayCircle },
              { title: "11. AI Class Insights", desc: "Deep analysis of student engagement and attendance patterns.", icon: BarChart3 },
              { title: "12. Admin Monitoring Panel", desc: "Real-time oversight and reporting for all active live sessions.", icon: Eye },
              { title: "13. Automation Engine Core", desc: "The brain of the system: set once, automate everything.", icon: Zap },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
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

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.courses}</h2>
          <p className="text-sm text-slate-500">Manage your course materials and lessons</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" /> Create New Course
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingCourses ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Courses Yet</h3>
            <p className="text-slate-500 mb-6">Create your first course to start managing materials.</p>
            <Button variant="primary" className="gap-2" onClick={() => handleCreateCourse({ name: 'New Course', students: 0, lessons: 0, progress: 0 })}>
              <Plus className="w-4 h-4" /> Create First Course
            </Button>
          </div>
        ) : (
          courses.map((course, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-50 rounded-xl">
                  <BookOpen className="w-6 h-6 text-brand-500" />
                </div>
                <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{course.name}</h4>
              <div className="text-xs text-slate-500 mb-4">{course.students || 0} Students • {course.lessons || 0} Lessons</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Course Progress</span>
                  <span className="text-brand-500">{course.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all duration-1000" style={{ width: `${course.progress || 0}%` }} />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-6 text-xs">Manage Content</Button>
            </div>
          ))
        )}
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
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display">Teacher LMS</span>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)] custom-scrollbar">
          {[
            { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
            { id: 'courses', label: t.courses, icon: BookOpen },
            { id: 'liveClass', label: t.liveClass, icon: Video },
            { id: 'assignments', label: t.assignments, icon: FileEdit },
            { id: 'grading', label: t.grading, icon: ClipboardCheck },
            { id: 'students', label: t.students, icon: Users },
            { id: 'attendance', label: t.attendance, icon: Calendar },
            { id: 'communication', label: t.communication, icon: MessageSquare },
            { id: 'guidance', label: t.guidance, icon: Library },
            { id: 'aiAssistant', label: t.aiAssistant, icon: Sparkles },
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
                placeholder="Search students, courses, or materials..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
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
                <div className="text-sm font-bold text-slate-800">Sarah Ahmed</div>
                <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Senior Teacher</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'liveClass' && renderLiveClasses()}
          {activeTab === 'aiAssistant' && renderAiAssistant()}
          {['assignments', 'grading', 'students', 'attendance', 'communication', 'guidance', 'settings'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Module Under Development</h2>
              <p className="text-slate-500 max-w-md">The {activeTab} module is currently being optimized for the best teacher experience.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
