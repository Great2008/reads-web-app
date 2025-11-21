// Base URL for the API
// On Vercel, we use the relative path which is routed via vercel.json
const API_URL = "/api"; 

// Helper to get the token from local storage
const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error('Login failed');
            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            return data;
        },
        signup: async (formData) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password,
                    name: formData.name 
                })
            });
            if (!res.ok) throw new Error('Signup failed');
            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            return data;
        },
        logout: async () => {
            localStorage.removeItem('access_token');
            // We don't need to call the backend for stateless JWT logout
        },
        // Helper to check if we are logged in on app load
        me: async () => {
            const res = await fetch(`${API_URL}/user/profile`, {
                headers: getAuthHeader()
            });
            if (!res.ok) return null;
            return await res.json();
        }
    },

    wallet: {
        getBalance: async () => {
            const res = await fetch(`${API_URL}/wallet/balance`, { headers: getAuthHeader() });
            if (!res.ok) return { balance: 0 };
            const data = await res.json();
            // Adapter: Backend returns 'token_balance', Frontend expects 'balance'
            return { balance: data.token_balance };
        }
    },

    learn: {
        getCategories: async () => {
            const res = await fetch(`${API_URL}/lessons/categories`, { headers: getAuthHeader() });
            if (!res.ok) return [];
            const data = await res.json();
            // Adapter: Map backend response to frontend props
            return data.map(cat => ({
                id: cat.category.toLowerCase(), 
                name: cat.category, 
                count: cat.count,
                // Assign colors based on category name for UI
                color: cat.category === 'JAMB' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }));
        },
        getLessons: async (categoryName) => {
            // Note: Backend expects exact category string "JAMB", not "jamb"
            const res = await fetch(`${API_URL}/lessons/category/${categoryName}`, { headers: getAuthHeader() });
            if (!res.ok) return [];
            const data = await res.json();
            return data.map(l => ({
                ...l,
                duration: '15 min' // Placeholder as backend DB doesn't have duration yet
            }));
        },
        completeLesson: async (lessonId) => {
             await fetch(`${API_URL}/lesson/${lessonId}/complete`, { 
                method: 'POST',
                headers: getAuthHeader() 
            });
        },
        submitQuiz: async (lessonId, score) => {
             // Note: Frontend logic calculates score, but Backend logic does too.
             // For MVP, we just trigger the backend calculation if needed, 
             // but currently the frontend QuizEngine handles the UI.
             // We need to adapt the frontend QuizEngine to call this properly later.
             // For now, return a mock success to keep UI working.
             return { earned: score > 50 ? 20 : 0 };
        }
    },

    profile: {
        getProfileData: (callback) => {
            // This replaces the Firebase onSnapshot with a simple fetch
            fetch(`${API_URL}/user/profile`, { headers: getAuthHeader() })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) callback({ ...data, displayId: data.id });
                });
            
            // No unsubscribe function needed for fetch
            return () => {};
        }
    }
};