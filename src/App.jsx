import React, { useState, useMemo } from 'react';
import { BookOpen, DollarSign, Zap, Target, TrendingUp, Wallet, CheckCircle, Bell, User, LayoutDashboard } from 'lucide-react';

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
};

const mockWalletData = {
  tokenBalance: 1200, // $READS
  earnedToday: 120,
};

// --- Components ---

/**
 * Reusable Card Component for Grid Items
 */
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

/**
 * Wallet Balance Card (Top Banner)
 */
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

/**
 * Learning Stats Card
 */
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

/**
 * Progress Bar Component
 */
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

/**
 * Next Lesson Card
 */
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

// --- DASHBOARD VIEWS ---

const HomeDashboard = ({ setActiveTab }) => (
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
      <Bell size={24} className="text-gray-500 cursor-pointer hover:text-indigo-600" />
    </header>

    {/* Token Balance */}
    <TokenBalanceCard />
    
    {/* Lessons and Tests Stats */}
    <LearningStatsCard />

    {/* Quick Action Grid */}
    <div className="grid grid-cols-2 gap-4 pt-2">
      <GridCard icon={BookOpen} title="Start Learning" onClick={() => {/* Handle Navigation to Learning */}} />
      <GridCard icon={CheckCircle} title="Take a Test" onClick={() => {/* Handle Navigation to Tests */}} />
      <GridCard icon={Wallet} title="Wallet" onClick={() => setActiveTab('wallet')} />
      {/* Empty Card to match layout in image, optional */}
      <div className="hidden sm:block"></div> 
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
    
    <TokenBalanceCard /> {/* Reusing the balance card */}

    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <DollarSign size={20} className="mr-2 text-green-600" />
        Transaction History (Mock)
      </h2>
      <ul className="divide-y divide-gray-200">
        <li className="flex justify-between py-3">
          <span>Daily Bonus</span>
          <span className="text-green-600">+100 $READS</span>
        </li>
        <li className="flex justify-between py-3">
          <span>Purchased Course</span>
          <span className="text-red-600">-500 $READS</span>
        </li>
        <li className="flex justify-between py-3">
          <span>Module Completion</span>
          <span className="text-green-600">+250 $READS</span>
        </li>
      </ul>
      <button className="w-full mt-4 bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600">
        View Full History
      </button>
    </div>
  </div>
);

// --- Main Application Component ---

const App = () => {
  // State for navigation: 'home', 'learn', 'wallet', 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Determine which component to render
  const renderDashboard = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard setActiveTab={setActiveTab} />;
      case 'learn':
        // Reuse the HomeDashboard structure or create a dedicated one later
        return <HomeDashboard setActiveTab={setActiveTab} />; 
      case 'wallet':
        return <WalletDashboard />;
      case 'profile':
        return <div className="p-8 text-center text-gray-500">Profile Settings Placeholder</div>;
      default:
        return <HomeDashboard setActiveTab={setActiveTab} />;
    }
  }, [activeTab]);

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

