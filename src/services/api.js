// Mock Data
const MOCK_DATA = {
  categories: [
    { id: 'jamb', name: 'JAMB', count: 12, color: 'bg-purple-100 text-purple-600' },
    { id: 'waec', name: 'WAEC', count: 15, color: 'bg-blue-100 text-blue-600' },
    { id: 'sat', name: 'SAT', count: 8, color: 'bg-pink-100 text-pink-600' },
    { id: 'ielts', name: 'IELTS', count: 5, color: 'bg-orange-100 text-orange-600' },
  ],
  lessons: {
    'jamb': [
      { id: 1, subject: 'Mathematics', title: 'Intro to Calculus', duration: '15 min' },
      { id: 2, subject: 'English', title: 'Vowel Sounds', duration: '10 min' },
    ],
    'waec': [{ id: 3, subject: 'Physics', title: 'Motion', duration: '20 min' }]
  },
  quiz: [
    { id: 1, q: "What is 2 + 2?", options: ["3", "4", "5"], a: 1 },
    { id: 2, q: "Capital of France?", options: ["London", "Berlin", "Paris"], a: 2 },
  ]
};

// API Service
export const api = {
  auth: {
    login: async (email, password) => {
      console.log(`[API] POST /auth/login payload:`, { email, password });
      return new Promise(resolve => setTimeout(() => {
        resolve({ 
          user: { id: 1, name: 'Alex Doe', email, avatar: 'https://i.pravatar.cc/150?img=11' },
          token: 'jwt_token_xyz'
        });
      }, 800));
    },
    signup: async (data) => {
      console.log(`[API] POST /auth/signup payload:`, data);
      return new Promise(resolve => setTimeout(() => {
        resolve({ 
          user: { id: 2, name: data.name, email: data.email, avatar: 'https://i.pravatar.cc/150?img=3' },
          token: 'jwt_token_abc'
        });
      }, 800));
    },
    resetPassword: async (email) => {
      console.log(`[API] POST /auth/reset payload:`, { email });
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    }
  },
  user: {
    getProfile: async () => {
      return { name: 'Alex Doe', email: 'alex@test.com' }; 
    }
  },
  wallet: {
    getBalance: async () => {
      return { balance: 150 };
    },
    getHistory: async () => {
      return [
        { id: 1, title: 'Signup Bonus', amount: 50, date: '2023-10-01' },
        { id: 2, title: 'Lesson Reward', amount: 100, date: '2023-10-02' }
      ];
    }
  },
  learn: {
    getCategories: async () => MOCK_DATA.categories,
    getLessons: async (catId) => MOCK_DATA.lessons[catId] || [],
    completeLesson: async (lessonId) => {
      console.log(`[API] POST /lessons/complete/${lessonId}`);
      return { success: true };
    },
    submitQuiz: async (lessonId, score) => {
      console.log(`[API] POST /quiz/submit`, { lessonId, score });
      const reward = score > 0 ? 50 : 10; 
      return { earned: reward, passed: true };
    }
  }
};