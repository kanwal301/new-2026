import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Shield, 
  Layout, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Search, 
  MessageSquare, 
  BarChart3, 
  Monitor, 
  Smartphone, 
  Tablet,
  Award,
  Star,
  Heart,
  Lightbulb,
  UserCheck,
  UserCog,
  Baby,
  User as UserIcon,
  Globe,
  TrendingUp,
  PieChart as PieChartIcon,
  Wallet,
  FileText,
  ClipboardList,
  Play,
  ArrowDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import React, { useState, useMemo, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, onAuthStateChanged } from './firebase';
import type { User } from './firebase';
import { Button } from './components/Button';
import { LoginModal } from './components/LoginModal';
import { AdminPortal } from './components/AdminPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { ParentPortal } from './components/ParentPortal';
import { StudentPortal } from './components/StudentPortal';
import { PricingModal } from './components/PricingModal';
import { cn } from './lib/utils';
import { LMSCard } from './components/LMSCard';
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
  Legend,
  PieChart,
  Cell,
  Pie
} from 'recharts';

// Translations
const translations = {
  en: {
    nav: {
      home: 'Home',
      features: 'Features',
      pricing: 'Pricing',
      about: 'About Us',
      getStarted: 'Get Started',
      login: 'Login',
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Flexible solutions for schools of all sizes',
      planA: {
        name: 'Basic Plan',
        price: 'Coming Soon',
        period: '',
        setup: 'Perfect for small schools',
        features: [
          'Up to 200 Students',
          'Attendance Tracking',
          'Basic Fee Management',
          'Parent Portal Access',
          'Standard Support'
        ],
        cta: 'Start Basic'
      },
      planB: {
        name: 'Pro Plan',
        price: 'Coming Soon',
        period: '',
        setup: 'Advanced school ecosystem',
        features: [
          'Up to 1000 Students',
          'Online Exams & Quizzes',
          'Full Fee ERP with JazzCash',
          'Staff Payroll & HR',
          'Priority 24/7 Support',
          'Custom Mobile App'
        ],
        cta: 'Go Pro'
      },
      planC: {
        name: 'Enterprise',
        price: 'Coming Soon',
        period: '',
        setup: 'For large school networks',
        features: [
          'Unlimited Students',
          'Multi-School Management',
          'Custom Integrations',
          'Dedicated Account Manager',
          'On-site Training',
          'White-label Solution'
        ],
        cta: 'Contact Sales'
      },
      modal: {
        title: 'Get Started with Pro',
        subtitle: 'Choose how you want to explore our professional features',
        bookDemo: 'Book a Live Demo',
        freeTrial: 'Start 14-Day Free Trial',
        formTitle: 'Registration Form (Google Sheet Style)',
        submit: 'Submit Information',
        success: 'Thank you! Your information has been sent to our team.',
        fields: {
          name: 'Full Name',
          school: 'School Name',
          email: 'Email Address',
          phone: 'Phone Number',
          type: 'Request Type'
        }
      }
    },
    hero: {
      title: 'Modern School Management LMS - Attendance, Fees, Assignments Sab Ek Jagah',
      subtitle: 'JazzCash/EasyPaisa payments, real-time notifications, parent portal included. The most comprehensive school digital ecosystem in Pakistan.',
      classMgmt: 'Class Management',
      attendance: 'Attendance Communication',
      cta: 'Start Free Demo',
      watchDemo: 'Watch Demo Video',
      trusted: 'Trusted by 500+ Schools Nationwide ~',
    },
    featuresRow: {
      title: 'Powerful Features for Modern Schools',
      subtitle: 'Everything you need to manage your institution efficiently',
      attendance: { title: 'Attendance Dashboard', desc: 'Real-time tracking with auto-SMS to parents.' },
      fees: { title: 'Fee Collection', desc: 'Integrated JazzCash & EasyPaisa payments.' },
      assignments: { title: 'Assignment Portal', desc: 'Digital submission and grading workflow.' },
      communication: { title: 'Parent Communication', desc: 'Instant notifications and mobile app access.' },
      exams: { title: 'Exam Management', desc: 'Result generation and performance tracking.' },
      mobile: { title: 'Mobile App', desc: 'Dedicated apps for parents and teachers.' }
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get started in 3 simple steps',
      step1: { title: 'School Register', desc: 'Sign up your school and configure your basic settings.' },
      step2: { title: 'Students Add', desc: 'Import student data and assign them to their respective classes.' },
      step3: { title: 'Everything Automated', desc: 'Sit back as attendance, fees, and results run on autopilot.' }
    },
    testimonials: {
      title: 'Trusted by School Leaders',
      subtitle: 'Hear from principals who transformed their schools with Pak Education',
      items: [
        { name: 'Dr. Ahmed Khan', role: 'Principal, Beaconhouse', quote: 'Pak Education has revolutionized how we manage our daily operations. The fee management is a lifesaver.' },
        { name: 'Mrs. Fatima Zahra', role: 'Director, City School', quote: 'The parent portal has significantly improved our communication with families. Highly recommended!' },
        { name: 'Mr. Salman Sheikh', role: 'Principal, Roots International', quote: 'The most user-friendly LMS we have ever used. The local payment integration is perfect for Pakistan.' },
        { name: 'Ms. Sana Malik', role: 'Headmistress, LGS', quote: 'Excellent support and powerful features. It has made our exam management completely paperless.' }
      ]
    },
    portals: {
      title: 'LMS Portals',
      subtitle: 'Tailored experiences for every member of your school community',
      admin: 'Admin LMS',
      adminDesc: 'Complete control over school operations, staff, and data.',
      teacher: 'Teacher LMS',
      teacherDesc: 'Tools for lesson planning, grading, and student engagement.',
      parent: 'Parent LMS',
      parentDesc: 'Stay updated on your child\'s progress and school fees.',
      student: 'Student LMS',
      studentDesc: 'Access assignments, online exams, and learning resources.',
      login: 'Open LMS Login',
      previews: {
        admin: ['Staff Control', 'Fee ERP', 'Payroll'],
        teacher: ['Lesson Plans', 'Grading', 'Attendance'],
        parent: ['Child Progress', 'Fee Status', 'Reports'],
        student: ['Assignments', 'Exams', 'AI Tutor']
      }
    },
    progress: {
      title: 'School Performance Analytics',
      subtitle: 'Comprehensive data visualization across all devices (Mobile, Tablet, PC)',
      studentGrowth: 'Student Enrollment Trend',
      attendanceRate: 'Daily Attendance Analytics',
      examPerformance: 'Academic Result Distribution',
      month: 'Month',
      students: 'Students',
      rate: 'Rate (%)',
      academic: 'Academic',
      attendance: 'Attendance',
      growth: 'Growth',
      nav: 'Progress',
      totalStudents: 'Total Students',
      totalTeachers: 'Total Teachers',
      activeCourses: 'Active Courses',
      passRate: 'Pass Rate',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
    },
    teacherTools: {
      title: 'Next-Gen Teacher Tools',
      subtitle: 'Empower Your Educators',
      tool1: 'Lesson Planning & Resources',
      sub1: 'Enhance Teaching Efficiency',
      tool2: 'Gradebook & Assessments',
      sub2: 'Gcheal Teaching Efficiency',
      tool3: 'Real-Time Communication',
      sub3: 'Real-Time Communication',
    },
    ceo: {
      title: 'Meet Our CEO',
      subtitle: 'Leading with Vision',
      stat1: '15+ Years in EdTech',
      stat2: 'Innovation & Excellence',
      stat3: 'Dedicated to School Success',
      stat4: 'Driving Educational Innovation',
    },
    footer: {
      desc: 'Providing high-level digital solutions for modern educational institutions across Pakistan and beyond.',
      rights: '© 2026 Pak Education. All rights reserved.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      trustedBy: 'Trusted by Leading Institutions',
      home: 'Home',
      features: 'Features',
      pricing: 'Pricing',
      about: 'About Us',
      address: 'Islamabad, Pakistan'
    }
  },
  ur: {
    nav: {
      home: 'ہوم',
      features: 'خصوصیات',
      pricing: 'قیمتیں',
      about: 'ہمارے بارے میں',
      getStarted: 'شروع کریں',
      login: 'لاگ ان',
    },
    pricing: {
      title: 'اپنا پلان منتخب کریں',
      subtitle: 'ہر سائز کے اسکولوں کے لیے لچکدار حل',
      planA: {
        name: 'بنیادی پلان',
        price: 'جلد آ رہا ہے',
        period: '',
        setup: 'چھوٹے اسکولوں کے لیے بہترین',
        features: [
          '200 طلباء تک',
          'حاضری ٹریکنگ',
          'بنیادی فیس مینجمنٹ',
          'پیرنٹ پورٹل تک رسائی',
          'معیاری سپورٹ'
        ],
        cta: 'بنیادی شروع کریں'
      },
      planB: {
        name: 'پرو پلان',
        price: 'جلد آ رہا ہے',
        period: '',
        setup: 'جدید اسکول ماحولیاتی نظام',
        features: [
          '1000 طلباء تک',
          'آن لائن امتحانات اور کوئز',
          'جاز کیش کے ساتھ مکمل فیس ERP',
          'اسٹاف پے رول اور HR',
          'ترجیحی 24/7 سپورٹ',
          'کسٹم موبائل ایپ'
        ],
        cta: 'پرو بنیں'
      },
      planC: {
        name: 'انٹرپرائز',
        price: 'جلد آ رہا ہے',
        period: '',
        setup: 'بڑے اسکول نیٹ ورکس کے لیے',
        features: [
          'لامحدود طلباء',
          'ملٹی اسکول مینجمنٹ',
          'کسٹم انٹیگریشنز',
          'سرشار اکاؤنٹ مینیجر',
          'آن سائٹ ٹریننگ',
          'وائٹ لیبل حل'
        ],
        cta: 'سیلز سے رابطہ کریں'
      },
      modal: {
        title: 'پرو کے ساتھ شروع کریں',
        subtitle: 'منتخب کریں کہ آپ ہماری پیشہ ورانہ خصوصیات کو کیسے دیکھنا چاہتے ہیں',
        bookDemo: 'لائیو ڈیمو بک کریں',
        freeTrial: '14 دن کا مفت ٹرائل شروع کریں',
        formTitle: 'رجسٹریشن فارم (گوگل شیٹ اسٹائل)',
        submit: 'معلومات جمع کرائیں',
        success: 'شکریہ! آپ کی معلومات ہماری ٹیم کو بھیج دی گئی ہیں۔',
        fields: {
          name: 'پورا نام',
          school: 'اسکول کا نام',
          email: 'ای میل ایڈریس',
          phone: 'فون نمبر',
          type: 'درخواست کی قسم'
        }
      }
    },
    hero: {
      title: 'جدید اسکول مینجمنٹ LMS - حاضری، فیس، اسائنمنٹس سب ایک جگہ',
      subtitle: 'جاز کیش/ایزی پیسہ ادائیگیاں، ریئل ٹائم اطلاعات، پیرنٹ پورٹل شامل ہے۔ پاکستان کا سب سے جامع اسکول ڈیجیٹل ماحولیاتی نظام۔',
      classMgmt: 'کلاس مینجمنٹ',
      attendance: 'حاضری مواصلات',
      cta: 'مفت ڈیمو شروع کریں',
      watchDemo: 'ڈیمو ویڈیو دیکھیں',
      trusted: 'ملک بھر کے 500+ اسکولوں کا بھروسہ ~',
    },
    featuresRow: {
      title: 'جدید اسکولوں کے لیے طاقتور خصوصیات',
      subtitle: 'اپنے ادارے کو مؤثر طریقے سے منظم کرنے کے لیے آپ کو ہر چیز کی ضرورت ہے',
      attendance: { title: 'حاضری ڈیش بورڈ', desc: 'والدین کو آٹو ایس ایم ایس کے ساتھ ریئل ٹائم ٹریکنگ۔' },
      fees: { title: 'فیس کلیکشن', desc: 'جاز کیش اور ایزی پیسہ ادائیگیوں کے ساتھ مربوط۔' },
      assignments: { title: 'اسائنمنٹ پورٹل', desc: 'ڈیجیٹل جمع کرانے اور گریڈنگ کا عمل۔' },
      communication: { title: 'والدین کے ساتھ رابطہ', desc: 'فوری اطلاعات اور موبائل ایپ تک رسائی۔' },
      exams: { title: 'امتحان مینجمنٹ', desc: 'نتائج کی تیاری اور کارکردگی کی ٹریکنگ۔' },
      mobile: { title: 'موبائل ایپ', desc: 'والدین اور اساتذہ کے لیے مخصوص ایپس۔' }
    },
    howItWorks: {
      title: 'یہ کیسے کام کرتا ہے',
      subtitle: '3 آسان مراحل میں شروع کریں',
      step1: { title: 'اسکول رجسٹر کریں', desc: 'اپنے اسکول کو سائن اپ کریں اور اپنی بنیادی ترتیبات ترتیب دیں۔' },
      step2: { title: 'طلباء شامل کریں', desc: 'طلباء کا ڈیٹا امپورٹ کریں اور انہیں ان کی متعلقہ کلاسوں میں تفویض کریں۔' },
      step3: { title: 'سب کچھ خودکار', desc: 'آرام سے بیٹھیں کیونکہ حاضری، فیس اور نتائج خود بخود چلتے ہیں۔' }
    },
    testimonials: {
      title: 'اسکول لیڈرز کا بھروسہ',
      subtitle: 'ان پرنسپلز سے سنیں جنہوں نے پاک ایجوکیشن کے ساتھ اپنے اسکولوں کو بدلا',
      items: [
        { name: 'ڈاکٹر احمد خان', role: 'پرنسپل، بیکن ہاؤس', quote: 'پاک ایجوکیشن نے ہمارے روزمرہ کے کاموں کو منظم کرنے کے طریقے میں انقلاب برپا کر دیا ہے۔ فیس مینجمنٹ ایک زندگی بچانے والا ٹول ہے۔' },
        { name: 'محترمہ فاطمہ زہرا', role: 'ڈائریکٹر، سٹی اسکول', quote: 'پیرنٹ پورٹل نے خاندانوں کے ساتھ ہمارے رابطے کو نمایاں طور پر بہتر کیا ہے۔ انتہائی سفارش کی جاتی ہے!' },
        { name: 'جناب سلمان شیخ', role: 'پرنسپل، روٹس انٹرنیشنل', quote: 'سب سے زیادہ صارف دوست LMS جو ہم نے کبھی استعمال کیا ہے۔ مقامی ادائیگی کا انٹیگریشن پاکستان کے لیے بہترین ہے۔' },
        { name: 'محترمہ ثناء ملک', role: 'ہیڈ مسٹریس، ایل جی ایس', quote: 'بہترین سپورٹ اور طاقتور خصوصیات۔ اس نے ہمارے امتحان کے انتظام کو مکمل طور پر پیپر لیس بنا دیا ہے۔' }
      ]
    },
    portals: {
      title: 'LMS پورٹلز',
      subtitle: 'آپ کی اسکول کمیونٹی کے ہر رکن کے لیے موزوں تجربات',
      admin: 'ایڈمن LMS',
      adminDesc: 'اسکول کے آپریشنز، عملے اور ڈیٹا پر مکمل کنٹرول۔',
      teacher: 'ٹیچر LMS',
      teacherDesc: 'سبق کی منصوبہ بندی، گریڈنگ، اور طلباء کی شمولیت کے اوزار۔',
      parent: 'پیرنٹ LMS',
      parentDesc: 'اپنے بچے کی ترقی اور اسکول کی فیسوں سے باخبر رہیں۔',
      student: 'اسٹوڈنٹ LMS',
      studentDesc: 'اسائنمنٹس، آن لائن امتحانات اور سیکھنے کے وسائل تک رسائی حاصل کریں۔',
      login: 'LMS لاگ ان کھولیں',
      previews: {
        admin: ['اسٹاف کنٹرول', 'فیس ERP', 'پے رول'],
        teacher: ['سبق کے منصوبے', 'گریڈنگ', 'حاضری'],
        parent: ['بچے کی ترقی', 'فیس کی صورتحال', 'رپورٹس'],
        student: ['اسائنمنٹس', 'امتحانات', 'AI ٹیوٹر']
      }
    },
    progress: {
      title: 'اسکول کی کارکردگی کے اعداد و شمار',
      subtitle: 'تمام آلات (موبائل، ٹیبلٹ، پی سی) پر جامع ڈیٹا ویژولائزیشن',
      studentGrowth: 'طلباء کے داخلے کا رجحان',
      attendanceRate: 'روزانہ حاضری کے اعداد و شمار',
      examPerformance: 'تعلیمی نتائج کی تقسیم',
      month: 'مہینہ',
      students: 'طلباء',
      rate: 'شرح (%)',
      academic: 'تعلیمی',
      attendance: 'حاضری',
      growth: 'اضافہ',
      nav: 'ترقی',
      totalStudents: 'کل طلباء',
      totalTeachers: 'کل اساتذہ',
      activeCourses: 'فعال کورسز',
      passRate: 'کامیابی کی شرح',
      privacy: 'رازداری کی پالیسی',
      terms: 'سروس کی شرائط',
      contact: 'ہم سے رابطہ کریں',
    },
    teacherTools: {
      title: 'جدید ٹیچر ٹولز',
      subtitle: 'اپنے اساتذہ کو بااختیار بنائیں',
      tool1: 'سبق کی منصوبہ بندی اور وسائل',
      sub1: 'تدریسی کارکردگی کو بہتر بنائیں',
      tool2: 'گریڈ بک اور اسیسمنٹ',
      sub2: 'تدریسی کارکردگی کو بڑھائیں',
      tool3: 'ریئل ٹائم مواصلات',
      sub3: 'فوری رابطہ کاری',
    },
    ceo: {
      title: 'ہمارے سی ای او سے ملیں',
      subtitle: 'وژن کے ساتھ رہنمائی',
      stat1: 'ایڈ ٹیک میں 15+ سال',
      stat2: 'جدت اور عمدگی',
      stat3: 'اسکول کی کامیابی کے لیے وقف',
      stat4: 'تعلیمی جدت کو آگے بڑھانا',
    },
    footer: {
      desc: 'پاکستان اور اس سے باہر جدید تعلیمی اداروں کے لیے اعلیٰ سطح کے ڈیجیٹل حل فراہم کرنا۔',
      rights: '© 2026 پاک ایجوکیشن۔ جملہ حقوق محفوظ ہیں۔',
      quickLinks: 'فوری لنکس',
      contactUs: 'ہم سے رابطہ کریں',
      trustedBy: 'معروف اداروں کا بھروسہ',
      home: 'ہوم',
      features: 'خصوصیات',
      pricing: 'قیمتیں',
      about: 'ہمارے بارے میں',
      address: 'اسلام آباد، پاکستان'
    }
  }
};

// Mock Data for Graphs
const enrollmentData = [
  { name: 'Jan', students: 400 },
  { name: 'Feb', students: 600 },
  { name: 'Mar', students: 800 },
  { name: 'Apr', students: 1200 },
  { name: 'May', students: 1500 },
  { name: 'Jun', students: 1800 },
];

const attendanceData = [
  { name: 'Mon', rate: 95 },
  { name: 'Tue', rate: 92 },
  { name: 'Wed', rate: 98 },
  { name: 'Thu', rate: 94 },
  { name: 'Fri', rate: 90 },
];

const performanceData = [
  { name: 'A+', value: 25 },
  { name: 'A', value: 35 },
  { name: 'B', value: 25 },
  { name: 'C', value: 10 },
  { name: 'D', value: 5 },
];

const COLORS = ['#0066cc', '#28a745', '#ffc107', '#fd7e14', '#dc3545'];

const ceoImages = [
  "https://storage.googleapis.com/m-infra.appspot.com/public/res/kanwalmehar301@gmail.com/6696788965048320/1742785366474_0.png",
  "https://storage.googleapis.com/m-infra.appspot.com/public/res/kanwalmehar301@gmail.com/6696788965048320/1742785366474_1.png",
  "https://storage.googleapis.com/m-infra.appspot.com/public/res/kanwalmehar301@gmail.com/6696788965048320/1742785366474_2.png"
];

const fallbackImage = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800";

// Firebase Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

// Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const state = (this as any).state;
    if (state.hasError) {
      let errorMessage = "Something went wrong.";
      if (state.error && state.error.message) {
        try {
          const parsedError = JSON.parse(state.error.message);
          errorMessage = `Firestore Error: ${parsedError.error} during ${parsedError.operationType} on ${parsedError.path}`;
        } catch (e) {
          errorMessage = state.error.message || errorMessage;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center">
          <GraduationCap className="w-16 h-16 text-blue-600 animate-bounce" />
          <p className="mt-4 text-blue-800 font-medium">Loading Pak Education...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, loading }}>
        <AppContent />
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pricingPlan, setPricingPlan] = useState<'starter' | 'professional'>('professional');
  const [isLoggedIn, setIsLoggedIn] = useState<false | 'admin' | 'teacher' | 'parent' | 'student'>(false);

  useEffect(() => {
    if (!user) {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const [currentCeoImageIndex, setCurrentCeoImageIndex] = useState(0);
  const [lastSelectedPortal, setLastSelectedPortal] = useState<string | null>(null);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [visitedPortals, setVisitedPortals] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lastLMSPortal');
    if (saved) setLastSelectedPortal(saved);

    const visited = localStorage.getItem('visitedLMSPortals');
    if (visited) setVisitedPortals(JSON.parse(visited));
  }, []);

  const handlePortalClick = (role: string) => {
    setLastSelectedPortal(role);
    localStorage.setItem('lastLMSPortal', role);

    if (!visitedPortals.includes(role)) {
      const newVisited = [...visitedPortals, role];
      setVisitedPortals(newVisited);
      localStorage.setItem('visitedLMSPortals', JSON.stringify(newVisited));
    }

    setIsLoginOpen(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCeoImageIndex((prev) => (prev + 1) % ceoImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  if (isLoggedIn === 'admin') {
    return <AdminPortal language={language} onLogout={handleLogout} />;
  }

  if (isLoggedIn === 'teacher') {
    return <TeacherPortal language={language} onLogout={handleLogout} />;
  }

  if (isLoggedIn === 'parent') {
    return <ParentPortal language={language} onLogout={handleLogout} />;
  }

  if (isLoggedIn === 'student') {
    return <StudentPortal language={language} onLogout={handleLogout} />;
  }

  return (
    <div className={cn("min-h-screen flex flex-col", language === 'ur' ? 'font-urdu' : 'font-sans')} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={(role) => setIsLoggedIn(role)}
        language={language} 
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        language={language}
        t={t}
        initialPlan={pricingPlan}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-brand-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg">
                <GraduationCap className="w-8 h-8 text-brand-500" />
              </div>
              <span className="text-2xl font-bold font-display tracking-tight">Pak Education</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm font-semibold hover:text-brand-100 transition-colors">{t.nav.home}</a>
              <a href="#features" className="text-sm font-semibold hover:text-brand-100 transition-colors">{t.nav.features}</a>
              <a href="#pricing" className="text-sm font-semibold hover:text-brand-100 transition-colors">{t.nav.pricing}</a>
              <a href="#about" className="text-sm font-semibold hover:text-brand-100 transition-colors">{t.nav.about}</a>
              
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-bold"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'اردو' : 'English'}
              </button>

              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-brand-500 font-bold" onClick={() => setIsLoginOpen(true)}>
                {t.nav.login}
              </Button>
              <Button variant="accent" size="sm" className="rounded-md font-bold" onClick={() => { setPricingPlan('professional'); setIsPricingOpen(true); }}>
                {t.nav.getStarted}
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLanguage} className="p-2 bg-white/10 rounded-lg">
                <Globe className="w-5 h-5" />
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-600 px-4 py-6 space-y-4">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">{t.nav.home}</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">{t.nav.features}</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">{t.nav.pricing}</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">{t.nav.about}</a>
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full border-white text-white" onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}>{t.nav.login}</Button>
              <Button variant="accent" className="w-full" onClick={() => { setPricingPlan('professional'); setIsPricingOpen(true); setIsMenuOpen(false); }}>{t.nav.getStarted}</Button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative pt-16 pb-24 bg-gradient-to-b from-brand-500 to-brand-600 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: language === 'en' ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6">
                  {t.hero.title}
                </h1>
                <p className="text-xl text-brand-100 mb-10 max-w-lg">
                  {t.hero.subtitle}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="bg-accent-500 p-2 rounded-lg">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm">{t.hero.classMgmt}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="bg-accent-500 p-2 rounded-lg">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm">{t.hero.attendance}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button variant="accent" size="lg" className="px-10 py-4 text-xl font-bold rounded-xl flex items-center gap-2" onClick={() => { setPricingPlan('professional'); setIsPricingOpen(true); }}>
                    {t.hero.cta}
                  </Button>
                  <Button variant="outline" size="lg" className="px-10 py-4 text-xl font-bold rounded-xl border-white text-white hover:bg-white/10 flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    {t.hero.watchDemo}
                  </Button>
                </div>
                
                <p className="mt-8 text-brand-200 text-sm italic">
                  {t.hero.trusted}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative min-h-[500px] flex items-center justify-center"
              >
                {/* Background School Image with Mask */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem]">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-brand-500/80 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200" 
                    alt="School Campus" 
                    className="w-full h-full object-cover opacity-40 scale-110 blur-[2px]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="relative w-full max-w-lg">
                    {/* PC Mockup */}
                    <div className="bg-slate-800 rounded-xl p-2 shadow-2xl border-4 border-slate-700">
                      <div className="bg-white rounded-lg aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-50 p-3 overflow-hidden">
                           <div className="flex justify-between items-center mb-3">
                             <div className="h-4 w-1/3 bg-brand-200 rounded" />
                             <div className="flex gap-1">
                               <div className="w-2 h-2 rounded-full bg-red-400" />
                               <div className="w-2 h-2 rounded-full bg-yellow-400" />
                               <div className="w-2 h-2 rounded-full bg-green-400" />
                             </div>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mb-3">
                             <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                               <div className="text-[8px] text-slate-400 uppercase font-bold">Attendance</div>
                               <div className="text-xs font-bold text-brand-500">94.2%</div>
                             </div>
                             <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                               <div className="text-[8px] text-slate-400 uppercase font-bold">Students</div>
                               <div className="text-xs font-bold text-accent-500">2,450</div>
                             </div>
                             <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                               <div className="text-[8px] text-slate-400 uppercase font-bold">Revenue</div>
                               <div className="text-xs font-bold text-orange-500">Rs. 1.2M</div>
                             </div>
                           </div>
                           <div className="h-24 bg-white rounded border border-slate-100 p-2">
                             <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={enrollmentData.slice(0, 4)}>
                                 <Area type="monotone" dataKey="students" stroke="#0066cc" fill="#0066cc" fillOpacity={0.1} />
                               </AreaChart>
                             </ResponsiveContainer>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Tablet Mockup */}
                    <div className="absolute -bottom-10 -left-10 w-1/2 bg-slate-800 rounded-xl p-1.5 shadow-2xl border-4 border-slate-700 hidden md:block">
                      <div className="bg-white rounded-lg aspect-[3/4] overflow-hidden">
                        <div className="p-3 space-y-3">
                          <div className="h-2 w-1/2 bg-slate-200 rounded" />
                          <div className="space-y-2">
                            <div className="h-8 bg-brand-50 rounded p-1 flex items-center justify-between">
                              <div className="w-4 h-4 rounded bg-brand-200" />
                              <div className="h-2 w-12 bg-brand-300 rounded" />
                            </div>
                            <div className="h-8 bg-brand-50 rounded p-1 flex items-center justify-between">
                              <div className="w-4 h-4 rounded bg-accent-200" />
                              <div className="h-2 w-12 bg-accent-300 rounded" />
                            </div>
                          </div>
                          <div className="h-20 bg-slate-50 rounded border border-slate-100 p-1">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={attendanceData}>
                                <Bar dataKey="rate" fill="#28a745" radius={[2, 2, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Mockup */}
                    <div className="absolute -bottom-4 -right-6 w-1/4 bg-slate-800 rounded-2xl p-1 shadow-2xl border-4 border-slate-700 hidden md:block">
                      <div className="bg-white rounded-xl aspect-[9/19] overflow-hidden">
                        <div className="p-2 space-y-2">
                          <div className="w-6 h-6 rounded-full bg-brand-500 mx-auto mt-2" />
                          <div className="h-1.5 w-3/4 bg-slate-100 rounded mx-auto" />
                          <div className="space-y-1 mt-4">
                            <div className="h-4 bg-slate-50 rounded" />
                            <div className="h-4 bg-slate-50 rounded" />
                            <div className="h-4 bg-slate-50 rounded" />
                          </div>
                          <div className="pt-2">
                            <div className="h-10 w-full bg-brand-500 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Row Section */}
        <section id="features-row" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{t.featuresRow.title}</h2>
              <p className="text-slate-600 font-medium">{t.featuresRow.subtitle}</p>
              <div className="w-24 h-1 bg-accent-500 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: t.featuresRow.attendance.title, desc: t.featuresRow.attendance.desc, icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
                { title: t.featuresRow.fees.title, desc: t.featuresRow.fees.desc, icon: Wallet, color: "text-green-500", bg: "bg-green-50" },
                { title: t.featuresRow.assignments.title, desc: t.featuresRow.assignments.desc, icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
                { title: t.featuresRow.communication.title, desc: t.featuresRow.communication.desc, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
                { title: t.featuresRow.exams.title, desc: t.featuresRow.exams.desc, icon: ClipboardList, color: "text-red-500", bg: "bg-red-50" },
                { title: t.featuresRow.mobile.title, desc: t.featuresRow.mobile.desc, icon: Smartphone, color: "text-brand-500", bg: "bg-brand-50" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white"
                >
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6", feature.bg)}>
                    <feature.icon className={cn("w-8 h-8", feature.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-brand-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t.howItWorks.title}</h2>
              <p className="text-brand-100 font-medium">{t.howItWorks.subtitle}</p>
              <div className="w-24 h-1 bg-accent-500 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", title: t.howItWorks.step1.title, desc: t.howItWorks.step1.desc },
                { step: "02", title: t.howItWorks.step2.title, desc: t.howItWorks.step2.desc },
                { step: "03", title: t.howItWorks.step3.title, desc: t.howItWorks.step3.desc }
              ].map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="text-6xl font-black text-white/10 absolute -top-10 left-1/2 -translate-x-1/2 z-0">
                    {step.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white/20">
                      <span className="text-xl font-bold">{i + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-brand-100 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%-2rem)] w-16 h-0.5 bg-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{t.testimonials.title}</h2>
              <p className="text-slate-600 font-medium">{t.testimonials.subtitle}</p>
              <div className="w-24 h-1 bg-accent-500 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.testimonials.items.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic mb-6 text-sm leading-relaxed">"{item.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 font-bold">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-slate-500 text-xs">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{t.pricing.title}</h2>
              <p className="text-slate-600 font-medium">{t.pricing.subtitle}</p>
              <div className="w-24 h-1 bg-accent-500 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Plan A - Basic */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.pricing.planA.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-brand-500">{t.pricing.planA.price}</span>
                    <span className="text-slate-500 font-medium">{t.pricing.planA.period}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold">{t.pricing.planA.setup}</p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {t.pricing.planA.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full py-6 text-lg font-bold border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white" onClick={() => { setPricingPlan('starter'); setIsPricingOpen(true); }}>
                  {t.pricing.planA.cta}
                </Button>
              </motion.div>

              {/* Plan B - Pro */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-brand-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col scale-105 z-10"
              >
                <div className="absolute top-0 right-0 bg-gold-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                  Popular
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{t.pricing.planB.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{t.pricing.planB.price}</span>
                    <span className="text-brand-100 font-medium">{t.pricing.planB.period}</span>
                  </div>
                  <p className="text-brand-100 text-sm font-semibold">{t.pricing.planB.setup}</p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {t.pricing.planB.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-white/20 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-brand-50">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="accent" className="w-full py-6 text-lg font-bold shadow-lg" onClick={() => { setPricingPlan('professional'); setIsPricingOpen(true); }}>
                  {t.pricing.planB.cta}
                </Button>
              </motion.div>

              {/* Plan C - Enterprise */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.pricing.planC.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-brand-500">{t.pricing.planC.price}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold">{t.pricing.planC.setup}</p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {t.pricing.planC.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full py-6 text-lg font-bold border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white" onClick={() => { setPricingPlan('professional'); setIsPricingOpen(true); }}>
                  {t.pricing.planC.cta}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portals Section */}
        <section id="features" className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-brand-500 mb-4 tracking-tight">{t.portals.title}</h2>
              <p className="text-slate-600 font-medium text-lg">{t.portals.subtitle}</p>
              <div className="w-24 h-1.5 bg-accent-500 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'admin', title: t.portals.admin, icon: UserCog, color: "bg-brand-500", desc: t.portals.adminDesc, previews: t.portals.previews.admin },
                { id: 'teacher', title: t.portals.teacher, icon: UserCheck, color: "bg-accent-500", desc: t.portals.teacherDesc, previews: t.portals.previews.teacher },
                { id: 'parent', title: t.portals.parent, icon: Baby, color: "bg-orange-500", desc: t.portals.parentDesc, previews: t.portals.previews.parent },
                { id: 'student', title: t.portals.student, icon: UserIcon, color: "bg-blue-400", desc: t.portals.studentDesc, previews: t.portals.previews.student }
              ].map((portal, i) => (
                <div 
                  key={i}
                  onMouseEnter={() => setHoveredPortal(portal.id)}
                  onMouseLeave={() => setHoveredPortal(null)}
                >
                  <LMSCard
                    title={portal.title}
                    icon={portal.icon}
                    color={portal.color}
                    desc={portal.desc}
                    onClick={() => handlePortalClick(portal.id)}
                    isSelected={lastSelectedPortal === portal.id}
                    isDimmed={hoveredPortal !== null && hoveredPortal !== portal.id}
                    isNew={!visitedPortals.includes(portal.id)}
                    previewItems={portal.previews}
                    language={language}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teacher Tools Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{t.teacherTools.title}</h2>
              <p className="text-slate-600 font-medium uppercase tracking-wider text-sm">{t.teacherTools.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: t.teacherTools.tool1, icon: BookOpen, color: "bg-accent-500", sub: t.teacherTools.sub1 },
                { title: t.teacherTools.tool2, icon: BarChart3, color: "bg-brand-500", sub: t.teacherTools.sub2 },
                { title: t.teacherTools.tool3, icon: MessageSquare, color: "bg-brand-700", sub: t.teacherTools.sub3 }
              ].map((tool, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => setIsLoginOpen(true)}>
                  <div className={cn("p-4 text-white font-bold rounded-t-xl text-center", tool.color)}>
                    {tool.title}
                  </div>
                  <div className="bg-slate-50 p-8 border-x border-b border-slate-200 rounded-b-xl text-center shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-inner flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <tool.icon className={cn("w-10 h-10", tool.color.replace('bg-', 'text-'))} />
                    </div>
                    <p className="text-brand-500 font-semibold text-sm">{tool.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CEO Section */}
        <section className="py-24 bg-white overflow-hidden" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-500/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 min-h-[500px] flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                  </div>
                  <img 
                    key={currentCeoImageIndex}
                    src={ceoImages[currentCeoImageIndex]} 
                    alt="CEO" 
                    className="relative z-10 w-full h-[500px] object-cover transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.previousElementSibling?.classList.add('hidden');
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.previousElementSibling?.classList.add('hidden');
                      if (target.src !== fallbackImage) {
                        target.src = fallbackImage;
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-brand-500 mb-2">{t.ceo.title}</h2>
                  <p className="text-slate-600 font-medium text-lg">{t.ceo.subtitle}</p>
                  <div className="w-20 h-1 bg-accent-500 mt-4" />
                </div>

                <div className="space-y-4">
                  {[
                    { text: t.ceo.stat1, icon: Star },
                    { text: t.ceo.stat2, icon: Award },
                    { text: t.ceo.stat3, icon: Heart },
                    { text: t.ceo.stat4, icon: Lightbulb }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-brand-500 text-white p-5 rounded-xl shadow-md hover:translate-x-2 transition-transform cursor-default">
                      <div className="bg-accent-500 p-2 rounded-lg">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-lg font-bold">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-500 p-1.5 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold font-display tracking-tight">Pak Education</span>
              </div>
              <p className="text-slate-400 mb-8 max-w-md">
                {t.footer.desc}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">{t.footer.quickLinks}</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#home" className="hover:text-white transition-colors">{t.footer.home}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{t.footer.features}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.footer.pricing}</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">{t.footer.about}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">{t.footer.contactUs}</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-500" />
                  <span>info@pakeducation.pk</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-500" />
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  <span>{t.footer.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* School Logos Row */}
          <div className="border-t border-white/10 pt-10 mb-10">
            <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">{t.footer.trustedBy}</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
              <div className="text-2xl font-black italic">BEACONHOUSE</div>
              <div className="text-2xl font-black italic">CITY SCHOOL</div>
              <div className="text-2xl font-black italic">ROOTS</div>
              <div className="text-2xl font-black italic">LGS</div>
              <div className="text-2xl font-black italic">APS</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              {t.footer.rights}
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">{t.progress.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.progress.terms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
