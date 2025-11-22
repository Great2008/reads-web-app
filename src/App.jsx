import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BookOpen, DollarSign, Zap, Target, TrendingUp, Wallet, CheckCircle, Bell, User, LayoutDashboard,
  LogIn, UserPlus, Mail, Lock, Clock, X, Globe
} from 'lucide-react';
// Required Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Static Data & Mocks ---

const mockUserData = {
  name: "John Doe",
  avatarUrl: "https://placehold.co/40x40/007bff/ffffff?text=JD", 
};

const mockLearningData = {
  lessonsCompleted: 14,
  testsPassed: 7,
  weeklyLessonsDone: 3,
  weeklyLessonsTotal: 5,
  nextLessonTitle: "Algebra Basics",
  tokenBalance: 1200, // $READS
  earnedToday: 120,
};


// --- Reusable Components for Dashboard Design ---

const DashboardHeader = ({ user, handleLogout }) => (
  <header className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-3">
          <img 
              src={user.avatarUrl} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
          />
          <div>
              <p className="text-sm text-gray-500">Welcome Back,</p>
              <p className="text-lg font-bold text-gray-900">{user.name}</p>
          </div>
      </div>
      <div className="flex items-center space-x-3">
          <Bell size={24} className="text-gray-500 cursor-pointer hover:text-indigo-600" />
      </div>
  </header>
);

const TokenBalanceCard = () => {
    const { tokenBalance, earnedToday } = mockLearningData;
    return (
        <div className="p-4 bg-white rounded-xl shadow-lg border-b-4 border-green-500 mx-4">
            <p className="text-sm text-gray-500 font-medium">Token Balance</p>
            <div className="text-4xl font-extrabold text-green-600 my-1">
                {tokenBalance} $READS
            </div>
            <div className="flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit">
                <TrendingUp size={16} className="mr-1" />
                <span>+${earnedToday} earned today</span>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="p-4 bg-white rounded-xl shadow-md flex flex-col items-start">
        <div className={`p-2 rounded-lg mb-2 ${color.bg} ${color.text}`}>
            <Icon size={20} />
        </div>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <p className="text-sm text-gray-600">{label}</p>
    </div>
);

const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button 
        className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-indigo-500 cursor-pointer"
        onClick={onClick}
    >
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mb-2">
            <Icon size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-700 text-center">{label}</p>
    </button>
);

const WeeklyProgressBar = () => {
    const { weeklyLessonsDone, weeklyLessonsTotal } = mockLearningData;
    const percentage = (weeklyLessonsDone / weeklyLessonsTotal) * 100;
    
    return (
        <div className="mt-4 p-5 bg-white rounded-xl shadow-md mx-4">
            <p className="text-sm text-gray-600 font-medium mb-2">Your Weekly Progress</p>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium">
                <p className="text-indigo-600">{weeklyLessonsDone}/{weeklyLessonsTotal} lessons completed</p>
                <p className="text-gray-600">{Math.round(percentage)}%</p>
            </div>
        </div>
    );
};

const NextLessonCard = () => (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md mx-4">
        <div>
            <p className="text-sm text-gray-500">Next Lesson</p>
            <p className="text-lg font-semibold text-gray-900 mb-3">{mockLearningData.nextLessonTitle}</p>
            <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
                Continue
            </button>
        </div>
        <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <BookOpen size={32} />
        </div>
    </div>
);


// --- DASHBOARD VIEWS ---

const HomeDashboardContent = ({ setActiveTab }) => (
  <div className="space-y-4 pb-4">
    <DashboardHeader user={mockUserData} />
    
    <TokenBalanceCard />
    
    {/* Stats Row */}
    <div className="grid grid-cols-2 gap-4 mx-4">
        <StatCard 
            icon={BookOpen} 
            value={mockLearningData.lessonsCompleted} 
            label="Lessons Completed" 
            color={{ bg: 'bg-green-100', text: 'text-green-600' }} 
        />
        <StatCard 
            icon={CheckCircle} 
            value={mockLearningData.testsPassed} 
            label="Tests Passed" 
            color={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }} 
        />
    </div>

    {/* Action Grid */}
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mx-4 pt-2">
        <ActionButton icon={BookOpen} label="Start Learning" onClick={() => {/* navigate */}} />
        <ActionButton icon={Clock} label="Take a Test" onClick={() => {/* navigate */}} />
        <ActionButton icon={Wallet} label="Wallet" onClick={() => setActiveTab('wallet')} />
        <ActionButton icon={User} label="Profile" onClick={() => setActiveTab('profile')} />
    </div>
    
    <WeeklyProgressBar />
    
    <NextLessonCard />
  </div>
);

const WalletDashboard = () => (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Wallet Dashboard</h1>
      <TokenBalanceCard />
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign size={20} className="mr-2 text-green-600" />
          Transaction History (Mock)
        </h2>
        <ul className="divide-y divide-gray-200">
          <li className="flex justify-between py-3"><span>Daily Bonus</span><span className="text-green-600">+100 $READS</span></li>
          <li className="flex justify-between py-3"><span>Purchased Course</span><span className="text-red-600">-500 $READS</span></li>
          <li className="flex justify-between py-3"><span>Module Completion</span><span className="text-green-600">+250 $READS</span></li>
        </ul>
        <button className="w-full mt-4 bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600">View Full History</button>
      </div>
    </div>
  );

// --- Authentication View (Using the second image design) ---

const AuthPage = ({ auth, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // This is the authentication method called on button click
    const handleAuth = async () => {
        if (!auth) {
            setError("Authentication service unavailable.");
            return;
        }
        setIsLoading(true);
        setError('');
        
        try {
            // NOTE: In a real app, you would use signInWithEmailAndPassword or createUserWithEmailAndPassword.
            // Here, we use anonymous sign-in as a proxy for successful authentication in the MVP environment.
            if (isLogin) {
                await signInAnonymously(auth); 
                console.log("Mock Login: Signed in anonymously.");
            } else {
                await signInAnonymously(auth);
                console.log("Mock Signup: Signed in anonymously.");
            }
            onLogin(); // Manually update state if needed, though onAuthStateChanged should handle it
        } catch (e) {
            setError(e.message || "An authentication error occurred.");
            console.error("Auth error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 font-sans">
            <div className="absolute top-4 right-4 text-gray-400 cursor-pointer">
                <Globe size={24} /> 
            </div>
            <div className="w-full max-w-sm p-8 rounded-2xl shadow-2xl border-t-8 border-indigo-600 bg-gray-800 text-white">
                <div className="flex justify-center mb-6">
                    {/* Placeholder for the token icon based on the image */}
                    <div className="p-4 bg-yellow-400 rounded-full shadow-md">
                        <DollarSign size={32} className="text-gray-800" /> 
                    </div>
                </div>
                
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to start learning and earning $READS tokens.</p>
                </div>
                
                {error && (
                    <div className="bg-red-700 bg-opacity-30 text-red-300 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button
                        onClick={handleAuth}
                        className={`w-full py-3 rounded-lg font-bold text-white transition duration-300 ${
                            isLoading ? 'bg-indigo-700 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-400 mt-4">
                    <a href="#" className="hover:text-white transition duration-150">Forgot Password?</a>
                </p>
                
                <p className="text-center text-sm text-gray-400 mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-indigo-400 hover:text-indigo-300 ml-1 font-semibold transition duration-150"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- Main Application Component ---

const App = () => {
  // --- Firebase/Auth/State Setup ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false); // New state to prevent rendering before auth initialization
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // 1. Initialize Firebase
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (!firebaseConfig) {
        console.error("Firebase config not available. Running in mock/offline mode.");
        setIsAuthReady(true);
        setIsLoggedIn(false); 
        return; 
    }

    try {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);
        
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        // 2. Handle initial auth and listen for changes
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                // User is authenticated (anonymous, token, or full)
                setIsLoggedIn(true);
                console.log(`User logged in with UID: ${user.uid}`);
            } else if (initialAuthToken) {
                // Attempt to sign in with custom token if available (Canvas environment)
                try {
                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                } catch(e) {
                    console.error("Custom token sign-in failed:", e);
                    // Fallback to anonymous sign-in if custom token fails
                    await signInAnonymously(firebaseAuth);
                }
            } else {
                // Default: use anonymous sign-in to satisfy security rules for MVP
                await signInAnonymously(firebaseAuth);
            }
            // CRITICAL FIX: Set ready state AFTER all auth initialization attempts are complete
            setIsAuthReady(true);
        });

        return () => unsubscribe(); // Cleanup subscription

    } catch (e) {
        console.error("Firebase initialization failed:", e);
        setIsAuthReady(true);
        setIsLoggedIn(false); 
    }

  }, []);

  const handleLogout = useCallback(async () => {
      if (auth) {
          try {
              await signOut(auth);
          } catch (e) {
              console.error("Logout failed:", e);
          }
      }
      setIsLoggedIn(false);
      setActiveTab('home'); 
  }, [auth]);


  // --- Conditional Rendering & Navigation ---

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-indigo-400 text-lg font-semibold animate-pulse">Initializing Security...</div>
      </div>
    );
  }

  // If not logged in, show the Auth Page (using the darker design)
  if (!isLoggedIn) {
      return <AuthPage auth={auth} onLogin={() => setIsLoggedIn(true)} />;
  }

  // Determine which component to render if logged in
  const renderDashboard = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboardContent setActiveTab={setActiveTab} />;
      case 'wallet':
        return <WalletDashboard />;
      case 'profile':
        return (
            <div className="p-8 text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-2">Authenticated User ID: {auth?.currentUser?.uid || 'N/A'}</p>
                <p className="text-gray-600 mb-4">This is where detailed profile information will go.</p>
                <button 
                    onClick={handleLogout} 
                    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
                >
                    Sign Out
                </button>
            </div>
        );
      default:
        return <HomeDashboardContent setActiveTab={setActiveTab} />;
    }
  }, [activeTab, auth, handleLogout]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <main className="max-w-md mx-auto">
        {renderDashboard}
      </main>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-20">
        <div className="flex justify-around max-w-md mx-auto">
          {[{ tab: 'home', icon: LayoutDashboard, label: 'Home' }, 
            { tab: 'learn', icon: BookOpen, label: 'Learn' }, 
            { tab: 'wallet', icon: Wallet, label: 'Wallet' }, 
            { tab: 'profile', icon: User, label: 'Profile' }].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center p-3 transition duration-200 ${
                activeTab === tab
                  ? 'text-indigo-600 font-bold'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;

