import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BookOpen, DollarSign, Zap, Target, TrendingUp, Wallet, CheckCircle, Bell, User, LayoutDashboard,
  LogIn, UserPlus, Mail, Lock
} from 'lucide-react';
// Required Firebase Imports (assumed available in the environment)
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { setLogLevel } from 'firebase/app';

// Set Firebase logging level for debugging (optional)
setLogLevel('debug');


// --- Static Data & Mocks ---

const mockUserData = {
  name: "John Doe",
  avatarUrl: "https://placehold.co/40x40/007bff/ffffff?text=JD", 
  email: "john.doe@reads.com"
};

const mockLearningData = {
  lessonsCompleted: 14,
  testsPassed: 7,
  weeklyLessonsDone: 3,
  weeklyLessonsTotal: 5,
  nextLessonTitle: "Algebra Basics",
};

const mockWalletData = {
  tokenBalance: 1200, // $READS
  earnedToday: 120,
};

// --- Reusable Components (from previous version, slightly modified) ---

const GridCard = ({ icon: Icon, title, onClick }) => (
  <div 
    className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-indigo-500 cursor-pointer"
    onClick={onClick}
  >
    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg mb-2">
      <Icon size={24} />
    </div>
    <p className="text-sm font-semibold text-gray-700 text-center">{title}</p>
  </div>
);

const TokenBalanceCard = () => (
  <div className="p-5 bg-white rounded-xl shadow-lg border-b-4 border-green-500 mb-6">
    <p className="text-sm text-gray-500 font-medium">Token Balance</p>
    <div className="text-4xl font-extrabold text-green-600 my-1">
      {mockWalletData.tokenBalance} $READS
    </div>
    <div className="flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit">
      <TrendingUp size={16} className="mr-1" />
      <span>+${mockWalletData.earnedToday} earned today</span>
    </div>
  </div>
);

const LearningStatsCard = () => (
  <div className="grid grid-cols-2 gap-4">
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex items-center text-green-600 mb-1">
        <BookOpen size={20} className="mr-2" />
        <span className="text-xl font-bold">{mockLearningData.lessonsCompleted}</span>
      </div>
      <p className="text-sm text-gray-600">Lessons Completed</p>
    </div>
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex items-center text-yellow-600 mb-1">
        <CheckCircle size={20} className="mr-2" />
        <span className="text-xl font-bold">{mockLearningData.testsPassed}</span>
      </div>
      <p className="text-sm text-gray-600">Tests Passed</p>
    </div>
  </div>
);

const ProgressBar = ({ done, total }) => {
  const percentage = (done / total) * 100;
  return (
    <div className="mt-4 p-5 bg-white rounded-xl shadow-md">
      <p className="text-sm text-gray-600 font-medium mb-2">Your Weekly Progress</p>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs font-medium">
        <p className="text-indigo-600">{done}/{total} lessons completed</p>
        <p className="text-gray-600">{Math.round(percentage)}%</p>
      </div>
    </div>
  );
};

const NextLessonCard = () => (
  <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md mt-6">
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


// --- Dashboard Views ---

const HomeDashboard = ({ setActiveTab, handleLogout }) => (
  <div className="p-4 space-y-4">
    {/* Header */}
    <header className="flex justify-between items-center pb-2">
      <div className="flex items-center space-x-3">
        <img 
          src={mockUserData.avatarUrl} 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full border-2 border-indigo-500"
        />
        <div>
          <p className="text-sm text-gray-500">Welcome Back,</p>
          <p className="text-lg font-bold text-gray-900">{mockUserData.name}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Bell size={24} className="text-gray-500 cursor-pointer hover:text-indigo-600" />
        <button 
            onClick={handleLogout} 
            className="text-sm text-red-500 hover:text-red-700 transition duration-150"
            title="Sign Out"
        >
            <LogIn size={20} className="transform rotate-180"/>
        </button>
      </div>
    </header>

    {/* Token Balance */}
    <TokenBalanceCard />
    
    {/* Lessons and Tests Stats */}
    <LearningStatsCard />

    {/* Quick Action Grid */}
    <div className="grid grid-cols-2 gap-4 pt-2">
      <GridCard icon={BookOpen} title="Start Learning" onClick={() => {/* Handle Navigation */}} />
      <GridCard icon={CheckCircle} title="Take a Test" onClick={() => {/* Handle Navigation */}} />
      <GridCard icon={Wallet} title="Wallet" onClick={() => setActiveTab('wallet')} />
      <GridCard icon={User} title="Profile" onClick={() => setActiveTab('profile')} /> 
    </div>
    
    {/* Weekly Progress */}
    <ProgressBar 
      done={mockLearningData.weeklyLessonsDone} 
      total={mockLearningData.weeklyLessonsTotal} 
    />
    
    {/* Next Lesson */}
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

// --- Authentication View ---

const AuthPage = ({ auth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async () => {
        if (!auth) {
            setError("Authentication service is not initialized.");
            return;
        }
        setIsLoading(true);
        setError('');
        
        // This is where your real authentication logic (e.g., createUserWithEmailAndPassword or signInWithEmailAndPassword) would go.
        // For the MVP, we will only allow anonymous sign-in via the App's useEffect, or wait for the custom token to kick in.
        try {
            if (isLogin) {
                // Mock: Automatically sign in anonymously to trigger the onAuthStateChanged in the parent App component
                await signInAnonymously(auth); 
                console.log("Mock Login attempted (triggered anonymous sign-in)");
            } else {
                 // Mock: Same sign-up will just trigger anonymous sign-in for the MVP
                await signInAnonymously(auth);
                console.log("Mock Signup attempted (triggered anonymous sign-in)");
            }
        } catch (e) {
            setError(e.message || "An authentication error occurred.");
            console.error("Auth error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-indigo-600">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-indigo-700">Reads</h1>
                    <p className="text-gray-500 mt-2">{isLogin ? 'Welcome Back' : 'Create Your Account'}</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button
                        onClick={handleAuth}
                        className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition duration-300 ${
                            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-indigo-600 hover:text-indigo-800 ml-1 font-semibold transition duration-150"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
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
  const [isAuthReady, setIsAuthReady] = useState(false); 
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // 1. Initialize Firebase
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (!firebaseConfig) {
        console.error("Firebase config not available. Running in mock mode.");
        setIsAuthReady(true);
        setIsLoggedIn(false); // Default to logged out in mock
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
                // User is authenticated (either token, anonymous, or full sign-in)
                setIsLoggedIn(true);
                console.log(`User logged in with UID: ${user.uid}`);
            } else if (initialAuthToken) {
                // Attempt to sign in with custom token if available (Canvas environment)
                await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
                // If no token, use anonymous sign-in to satisfy security rules for MVP
                await signInAnonymously(firebaseAuth);
            }
            setIsAuthReady(true);
        });

        // Cleanup subscription
        return () => unsubscribe();

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
      setActiveTab('home'); // Reset tab to home (which will redirect to auth)
  }, [auth]);


  // --- Conditional Rendering & Navigation ---

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-indigo-600 text-lg font-semibold">Loading App...</div>
      </div>
    );
  }

  // If not logged in, show the Auth Page
  if (!isLoggedIn) {
      return <AuthPage auth={auth} />;
  }

  // Determine which component to render if logged in
  const renderDashboard = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard setActiveTab={setActiveTab} handleLogout={handleLogout} />;
      case 'learn':
        // Placeholder for a dedicated Learn View
        return <HomeDashboard setActiveTab={setActiveTab} handleLogout={handleLogout} />; 
      case 'wallet':
        return <WalletDashboard />;
      case 'profile':
        return (
            <div className="p-8 text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-2">User ID: {auth?.currentUser?.uid || 'N/A'}</p>
                <p className="text-gray-600 mb-4">Email: {mockUserData.email}</p>
                <button 
                    onClick={handleLogout} 
                    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
                >
                    Sign Out
                </button>
            </div>
        );
      default:
        return <HomeDashboard setActiveTab={setActiveTab} handleLogout={handleLogout} />;
    }
  }, [activeTab, handleLogout, auth]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <main className="max-w-md mx-auto">
        {renderDashboard}
      </main>
      
      {/* Bottom Navigation Bar (Fixed for Mobile) */}
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

