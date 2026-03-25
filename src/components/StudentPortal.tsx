import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileEdit, 
  BrainCircuit, 
  BarChart3, 
  Trophy, 
  MessageSquare, 
  Calendar, 
  Library, 
  Timer, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Upload,
  Send, 
  Plus, 
  MoreVertical, 
  ChevronRight, 
  LogOut, 
  Search, 
  Play, 
  Award, 
  Flame, 
  Target, 
  Zap, 
  GraduationCap,
  User,
  Monitor,
  Brain,
  Lock,
  UserCheck,
  XCircle,
  Link as LinkIcon,
  Mail,
  PlayCircle,
  Eye
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
  LineChart,
  Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { db, handleFirestoreError } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { OperationType } from '../firebase';

interface StudentPortalProps {
  onLogout: () => void;
  language: 'en' | 'ur';
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onLogout, language }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    // In a real app, we'd filter by courseId or studentId
    const q = query(collection(db, 'assignments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assignmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(assignmentsData);
      setLoadingAssignments(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'assignments');
      setLoadingAssignments(false);
    });

    return () => unsubscribe();
  }, []);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignmentView, setAssignmentView] = useState<'list' | 'detail'>('list');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const isRtl = language === 'ur';

  const t = {
    en: {
      dashboard: 'Dashboard',
      courses: 'My Courses',
      liveClass: 'Live Classes',
      assignments: 'Assignments',
      aiTutor: 'AI Tutor',
      performance: 'My Progress',
      practice: 'Smart Practice',
      gamification: 'Rewards',
      communication: 'Doubt Solving',
      planner: 'Study Planner',
      library: 'Resources',
      productivity: 'Focus Room',
      exams: 'Exams',
      logout: 'Logout',
      welcome: 'Welcome, Student!',
      todayClasses: "Today's Schedule",
      pendingAssignments: 'Pending Tasks',
      upcomingExams: 'Exam Countdown',
      points: 'Points',
      streak: 'Daily Streak',
      badges: 'Badges Earned',
      aiPlaceholder: 'Ask your AI Tutor to explain a topic, summarize a lesson, or help with a problem...',
      explainTopic: 'Explain Topic',
      summarize: 'Summarize',
      studyPlan: 'Create Study Plan',
      startTimer: 'Start Focus Timer',
      joinClass: 'Join Live Class',
      submitWork: 'Submit Assignment',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      courses: 'میرے کورسز',
      liveClass: 'لائیو کلاسز',
      assignments: 'اسائنمنٹس',
      aiTutor: 'AI ٹیوٹر',
      performance: 'میری ترقی',
      practice: 'سمارٹ پریکٹس',
      gamification: 'انعامات',
      communication: 'شک دور کریں',
      planner: 'اسٹڈی پلانر',
      library: 'وسائل',
      productivity: 'فوکس روم',
      exams: 'امتحانات',
      logout: 'لاگ آؤٹ',
      welcome: 'خوش آمدید، طالب علم!',
      todayClasses: 'آج کا شیڈول',
      pendingAssignments: 'زیر التواء کام',
      upcomingExams: 'امتحان کا کاؤنٹ ڈاؤن',
      points: 'پوائنٹس',
      streak: 'ڈیلی اسٹریک',
      badges: 'حاصل کردہ بیجز',
      aiPlaceholder: 'اپنے AI ٹیوٹر سے کسی موضوع کی وضاحت، سبق کا خلاصہ، یا مسئلہ حل کرنے کا کہیں...',
      explainTopic: 'موضوع کی وضاحت',
      summarize: 'خلاصہ کریں',
      studyPlan: 'اسٹڈی پلان بنائیں',
      startTimer: 'فوکس ٹائمر شروع کریں',
      joinClass: 'لائیو کلاس میں شامل ہوں',
      submitWork: 'اسائنمنٹ جمع کروائیں',
    }
  }[language];

  // Pomodoro Timer Logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false);
      alert('Focus session complete! Take a break.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAiTutor = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ parts: [{ text: `You are a friendly and expert AI Student Tutor. Help the student with their request. Explain topics simply, provide summaries, or create study plans. Request: ${aiPrompt}` }] }],
      });
      setAiResponse(response.text || 'I am here to help! Please try again.');
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Oops! My brain is a bit fuzzy right now. Please check your connection.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Stats & Gamification */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.points, value: '1,250', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: t.streak, value: '12 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Rank', value: '#4', icon: Trophy, color: 'text-brand-500', bg: 'bg-brand-50' },
          { label: 'Completed', value: '85%', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon className="w-20 h-20" />
            </div>
            <div className={cn("p-2 rounded-lg w-fit mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
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
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              {t.todayClasses}
            </h3>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">March 24, 2026</span>
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', topic: 'Algebraic Expressions', time: '09:00 AM', teacher: 'Ms. Sarah', status: 'Live Now' },
              { subject: 'Physics', topic: 'Quantum Mechanics Intro', time: '11:00 AM', teacher: 'Mr. Ahmed', status: 'Upcoming' },
              { subject: 'English', topic: 'Creative Writing', time: '01:30 PM', teacher: 'Ms. Fatima', status: 'Upcoming' },
            ].map((item, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                item.status === 'Live Now' ? "bg-brand-50 border-brand-200 shadow-md" : "bg-slate-50 border-slate-100"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center border",
                    item.status === 'Live Now' ? "bg-white border-brand-200" : "bg-white border-slate-200"
                  )}>
                    {item.status === 'Live Now' ? <Play className="w-6 h-6 text-brand-500 fill-brand-500" /> : <Clock className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.subject}</div>
                    <div className="text-xs text-slate-500">{item.topic} • {item.teacher}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700 mb-2">{item.time}</div>
                  <Button variant={item.status === 'Live Now' ? 'primary' : 'outline'} size="sm" className="text-[10px] px-4">
                    {item.status === 'Live Now' ? t.joinClass : 'Remind Me'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Streaks */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              {t.pendingAssignments}
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Math Quiz', due: 'Tomorrow', urgency: 'High' },
                { title: 'Physics Lab Report', due: 'In 2 days', urgency: 'Medium' },
              ].map((alert, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-xl border flex items-center gap-3",
                  alert.urgency === 'High' ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
                )}>
                  <AlertCircle className={cn("w-5 h-5", alert.urgency === 'High' ? "text-red-500" : "text-orange-500")} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{alert.title}</div>
                    <div className="text-[10px] text-slate-500">Due: {alert.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Award className="w-24 h-24" />
            </div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Study Goal
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-xs font-bold">
                <span>3.5 / 5 Hours</span>
                <span>70%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] opacity-80 italic">"Almost there! Just 1.5 more hours to hit your daily target."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Not Started': return 'bg-slate-100 text-slate-600';
        case 'In Progress': return 'bg-blue-100 text-blue-600';
        case 'Submitted': return 'bg-yellow-100 text-yellow-600';
        case 'Graded': return 'bg-green-100 text-green-600';
        default: return 'bg-slate-100 text-slate-600';
      }
    };

    const getUrgencyColor = (urgency: string) => {
      switch (urgency) {
        case 'High': return 'text-red-500';
        case 'Medium': return 'text-orange-500';
        case 'Low': return 'text-green-500';
        default: return 'text-slate-500';
      }
    };

    if (assignmentView === 'detail' && selectedAssignment) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAssignmentView('list')}
              className="gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to List
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {selectedAssignment.subject}
                      </span>
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(selectedAssignment.status))}>
                        {selectedAssignment.status}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedAssignment.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Remaining</div>
                    <div className="text-xl font-black text-red-500 flex items-center justify-end gap-2">
                      <Timer className="w-5 h-5" />
                      1d 04h 22m
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileEdit className="w-5 h-5 text-brand-500" />
                      Instructions
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {selectedAssignment.description}
                    </p>
                  </div>

                  {selectedAssignment.attachments && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-3">Resources & Attachments</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedAssignment.attachments.map((file: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-brand-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-700">{file.name}</div>
                                <div className="text-[10px] text-slate-400">{file.size}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-brand-500">Download</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAssignment.status === 'Graded' && (
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                      <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Feedback & Grade
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</div>
                          <div className="text-3xl font-black text-green-600">{selectedAssignment.score}%</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grade</div>
                          <div className="text-3xl font-black text-brand-500">{selectedAssignment.grade}</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Points</div>
                          <div className="text-3xl font-black text-blue-600">+{selectedAssignment.points}</div>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-green-200 italic text-sm text-slate-700">
                        "{selectedAssignment.feedback}"
                      </div>
                    </div>
                  )}

                  {selectedAssignment.status !== 'Graded' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-brand-500" />
                          Collaborators
                        </h3>
                        <div className="flex -space-x-3 mb-4">
                          {[1, 2, 3].map((_, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                              {['JD', 'AS', 'MK'][i]}
                            </div>
                          ))}
                          <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 hover:border-brand-500 hover:text-brand-500 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Group mode active. Changes are synced in real-time.</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-brand-500" />
                          Discussion
                        </h3>
                        <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar mb-4">
                          <div className="p-2 bg-slate-50 rounded-xl text-[10px]">
                            <span className="font-bold text-brand-600">John:</span> I've uploaded the first draft of the methodology.
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl text-[10px]">
                            <span className="font-bold text-brand-600">Sara:</span> Looks good! I'll check the accuracy part.
                          </div>
                        </div>
                        <div className="relative">
                          <input type="text" placeholder="Type a message..." className="w-full pl-3 pr-10 py-2 bg-slate-100 border-none rounded-xl text-[10px] outline-none" />
                          <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAssignment.status !== 'Submitted' && selectedAssignment.status !== 'Graded' && (
                    <div className="pt-8 border-t border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Send className="w-5 h-5 text-brand-500" />
                        Submit Your Work
                      </h3>
                      <div className="space-y-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer group">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-100 transition-all">
                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-500" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">Drag and drop your files here</h4>
                          <p className="text-xs text-slate-400">PDF, DOCX, or ZIP (Max 100MB)</p>
                          <input type="file" className="hidden" />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="outline" className="flex-1 py-6 rounded-2xl font-bold">Save Draft</Button>
                          <Button variant="primary" className="flex-[2] py-6 rounded-2xl font-bold shadow-lg shadow-brand-500/20">Final Submission</Button>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center italic">
                          * Plagiarism check will be automatically performed upon submission.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Submission Info</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Deadline</span>
                    <span className="text-sm font-black text-red-500">Tomorrow, 11:59 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                    <span className={cn("text-xs font-black px-2 py-1 rounded-lg", getStatusColor(selectedAssignment.status))}>
                      {selectedAssignment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Points</span>
                    <span className="text-sm font-black text-brand-500">{selectedAssignment.points} XP</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-4">Grading Rubric</div>
                    <div className="space-y-4">
                      {[
                        { name: 'Content', weight: '40%', level: 'Excellent' },
                        { name: 'Grammar', weight: '30%', level: 'Good' },
                        { name: 'Structure', weight: '30%', level: 'Fair' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-bold text-slate-800">{item.name}</div>
                            <div className="text-[8px] text-slate-400 uppercase tracking-widest">Weight: {item.weight}</div>
                          </div>
                          <span className="text-[10px] font-black text-brand-500">{item.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-20 h-20 text-brand-500" />
                </div>
                <h3 className="text-lg font-bold mb-4">AI Assistant</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed font-medium italic">
                  "I've analyzed the instructions. Focus on the 'Trigonometric Substitution' part as it carries 40% of the weight. Need a hint?"
                </p>
                <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold py-4">Get AI Hint</Button>
              </div>
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
              My <span className="text-brand-500">Assignments</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Manage your tasks, track deadlines, and view feedback.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search assignments..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-xl">
              <BarChart3 className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Overall Progress & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Assignment Performance</h3>
                <p className="text-xs text-slate-500 font-medium">Your score trend compared to class average.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-500 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Class Avg</span>
                </div>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'A1', score: 85, avg: 78 },
                  { name: 'A2', score: 92, avg: 80 },
                  { name: 'A3', score: 88, avg: 82 },
                  { name: 'A4', score: 95, avg: 85 },
                ]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '700' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  <Area type="monotone" dataKey="avg" stroke="#e2e8f0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Term Completion</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                  <circle cx="64" cy="64" r="58" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - 0.72)} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">72%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-lg font-black text-green-600">18</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Completed</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-lg font-black text-orange-600">04</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAssignments ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <FileEdit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Assignments</h3>
              <p className="text-slate-500">You're all caught up! Check back later for new tasks.</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all group cursor-pointer"
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setAssignmentView('detail');
                }}
              >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl", 
                  assignment.status === 'Graded' ? "bg-green-50" : 
                  assignment.status === 'Submitted' ? "bg-yellow-50" : "bg-brand-50"
                )}>
                  <FileEdit className={cn("w-6 h-6", 
                    assignment.status === 'Graded' ? "text-green-500" : 
                    assignment.status === 'Submitted' ? "text-yellow-500" : "text-brand-500"
                  )} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest", getStatusColor(assignment.status))}>
                    {assignment.status}
                  </span>
                  <div className={cn("flex items-center gap-1 mt-2 text-[10px] font-bold", getUrgencyColor(assignment.urgency))}>
                    <Clock className="w-3 h-3" />
                    {assignment.urgency} Urgency
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-brand-500 transition-colors leading-tight">
                {assignment.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">{assignment.subject}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Due Date</span>
                  <span className="text-slate-900">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                {assignment.status === 'Graded' ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-[10px] font-bold text-green-600 uppercase">Grade</span>
                    <span className="text-lg font-black text-green-600">{assignment.grade} ({assignment.score}%)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Points</span>
                    <span className="text-sm font-black text-slate-900">{assignment.points} XP</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-500 flex items-center justify-center text-[8px] font-bold text-white">
                    +5
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

  const renderLiveClasses = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            My Live <span className="text-brand-500">Classes</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Join your virtual classroom and access recorded sessions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Student Live Class Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Classes Today', value: '3', icon: Video, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Attendance Rate', value: '96%', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Engagement Score', value: '92/100', icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Watch Time', value: '24h', icon: PlayCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
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
        {/* Upcoming Classes */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Live Sessions</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Join your classes on time to maintain your attendance streak.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { subject: 'Advanced Mathematics', topic: 'Calculus Integration', teacher: 'Prof. Ahmed Ali', date: 'Today, 10:00 AM', status: 'Live Now', platform: 'Zoom' },
                { subject: 'Physics', topic: 'Quantum Mechanics', teacher: 'Dr. Sara Khan', date: 'Today, 02:00 PM', status: 'Upcoming', platform: 'Google Meet' },
                { subject: 'Computer Science', topic: 'AI & Machine Learning', teacher: 'Eng. Zaid Malik', date: 'Tomorrow, 11:30 AM', status: 'Upcoming', platform: 'Zoom' },
              ].map((session, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-6 p-5 rounded-2xl border transition-all group",
                  session.status === 'Live Now' ? "bg-brand-50 border-brand-200 shadow-lg shadow-brand-500/10" : "bg-slate-50 border-slate-100"
                )}>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-sm border",
                    session.status === 'Live Now' ? "bg-white border-brand-200" : "bg-white border-slate-200"
                  )}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{session.date.split(',')[0]}</span>
                    <span className={cn("text-lg font-black", session.status === 'Live Now' ? "text-brand-500" : "text-slate-700")}>{session.date.split(',')[1].split(' ')[0]}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{session.subject}</h4>
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider",
                        session.status === 'Live Now' ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-600"
                      )}>{session.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 font-medium">{session.topic}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <User className="w-3 h-3" />
                        {session.teacher}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <Monitor className="w-3 h-3" />
                        {session.platform}
                      </div>
                    </div>
                  </div>
                  <Button variant={session.status === 'Live Now' ? 'primary' : 'outline'} className="rounded-xl px-6">
                    {session.status === 'Live Now' ? 'Join Now' : 'Set Reminder'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recorded Sessions */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Class Recordings</h3>
              <Button variant="ghost" size="sm" className="text-brand-500 font-bold uppercase tracking-widest">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Algebraic Expressions', subject: 'Mathematics', date: '22 Mar 2026', duration: '45m', thumbnail: 'https://picsum.photos/seed/math/400/225' },
                { title: 'Newton\'s Laws of Motion', subject: 'Physics', date: '21 Mar 2026', duration: '52m', thumbnail: 'https://picsum.photos/seed/physics/400/225' },
              ].map((rec, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                    <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-brand-500 fill-brand-500" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded">
                      {rec.duration}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-500 transition-colors">{rec.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1">
                    <span>{rec.subject}</span>
                    <span>•</span>
                    <span>{rec.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Tutor & Reminders */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Smart Reminders */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32 text-brand-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold tracking-tight leading-none">AI Smart<br/><span className="text-brand-400">Reminders</span></h3>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Next Class", desc: "Math in 15 minutes.", icon: Clock },
                  { title: "Preparation", desc: "Review Algebra notes.", icon: Brain },
                  { title: "Secure Access", desc: "Link auto-generated.", icon: Lock },
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
                <p className="text-[9px] text-slate-400 leading-relaxed italic">"AI will notify you 1 day, 1 hour, and 10 minutes before every class."</p>
              </div>
            </div>
          </div>

          {/* My Engagement Insights */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Learning Insights</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>My Engagement</span>
                  <span className="text-brand-500">92%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-[92%] rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-bold text-purple-600 uppercase">AI Tutor Tip</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">You participate most during morning sessions. Try to schedule your hardest subjects then!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiTutor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-brand-500" />
            {t.aiTutor}
          </h2>
          <p className="text-sm text-slate-500">Your 24/7 personalized learning companion</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t.aiPlaceholder}
            className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setAiPrompt('Explain the concept of Photosynthesis in simple words.')}>
              {t.explainTopic}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAiPrompt('Summarize the main points of the French Revolution.')}>
              {t.summarize}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAiPrompt('Create a 4-week study plan for my upcoming Math exams.')}>
              {t.studyPlan}
            </Button>
            <div className="flex-grow" />
            <Button 
              variant="primary" 
              className="gap-2 px-8 py-6 rounded-2xl shadow-lg shadow-brand-500/20"
              onClick={handleAiTutor}
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              Ask AI Tutor
            </Button>
          </div>
        </div>
      </div>

      {aiResponse && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              AI Tutor Response
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Save to Notes
              </Button>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductivity = () => (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.productivity}</h2>
        <p className="text-slate-500">Boost your focus with the Pomodoro technique. No distractions, just learning.</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-xl mx-auto">
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - pomodoroTime / (25 * 60))}
              className="text-brand-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-slate-800 font-mono">{formatTime(pomodoroTime)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Focus Session</div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            variant={isTimerRunning ? 'outline' : 'primary'} 
            size="lg" 
            className="px-10 py-6 rounded-2xl text-xl font-bold"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? 'Pause' : 'Start Focus'}
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="px-10 py-6 rounded-2xl text-xl font-bold"
            onClick={() => {
              setIsTimerRunning(false);
              setPomodoroTime(25 * 60);
            }}
          >
            Reset
          </Button>
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
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display">Student LMS</span>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)] custom-scrollbar">
          {[
            { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
            { id: 'courses', label: t.courses, icon: BookOpen },
            { id: 'liveClass', label: t.liveClass, icon: Video },
            { id: 'assignments', label: t.assignments, icon: FileEdit },
            { id: 'aiTutor', label: t.aiTutor, icon: BrainCircuit },
            { id: 'performance', label: t.performance, icon: BarChart3 },
            { id: 'practice', label: t.practice, icon: Target },
            { id: 'gamification', label: t.gamification, icon: Trophy },
            { id: 'communication', label: t.communication, icon: MessageSquare },
            { id: 'planner', label: t.planner, icon: Calendar },
            { id: 'library', label: t.library, icon: Library },
            { id: 'productivity', label: t.productivity, icon: Timer },
            { id: 'exams', label: t.exams, icon: Award },
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
                placeholder="Search courses, lessons, or AI help..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold border border-yellow-100">
              <Zap className="w-4 h-4 fill-yellow-500" />
              1,250 XP
            </div>
            <button className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Ali Khan</div>
                <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Grade 10-A</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                AK
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'liveClass' && renderLiveClasses()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'aiTutor' && renderAiTutor()}
          {activeTab === 'productivity' && renderProductivity()}
          {['courses', 'performance', 'practice', 'gamification', 'communication', 'planner', 'library', 'exams'].includes(activeTab) && activeTab !== 'aiTutor' && activeTab !== 'productivity' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Module Under Development</h2>
              <p className="text-slate-500 max-w-md">The {activeTab} module is currently being optimized for the best student experience.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
