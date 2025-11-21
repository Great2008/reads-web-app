const API_URL = "/api"; 

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
            
            const data = await res.json();
            
            if (!res.ok) {
                // Alert the user so we know why it failed
                alert(`Login Failed: ${data.detail || 'Unknown Error'}`); 
                throw new Error(data.detail || 'Login failed');
            }
            
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
            
            const data = await res.json();

            if (!res.ok) {
                // Alert the user so we know why it failed
                alert(`Signup Failed: ${data.detail || 'Unknown Error'}`);
                throw new Error(data.detail || 'Signup failed');
            }
            
            localStorage.setItem('access_token', data.access_token);
            return data;
        },
        logout: async () => {
            localStorage.removeItem('access_token');
        },
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
            return { balance: data.token_balance };
        }
    },

    learn: {
        getCategories: async () => {
            const res = await fetch(`${API_URL}/lessons/categories`, { headers: getAuthHeader() });
            if (!res.ok) return [];
            const data = await res.json();
            return data.map(cat => ({
                id: cat.category.toLowerCase(), 
                name: cat.category, 
                count: cat.count,
                color: cat.category === 'JAMB' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }));
        },
        getLessons: async (categoryName) => {
            const res = await fetch(`${API_URL}/lessons/category/${categoryName}`, { headers: getAuthHeader() });
            if (!res.ok) return [];
            const data = await res.json();
            return data.map(l => ({
                ...l,
                duration: '15 min'
            }));
        },
        completeLesson: async (lessonId) => {
             await fetch(`${API_URL}/lesson/${lessonId}/complete`, { 
                method: 'POST',
                headers: getAuthHeader() 
            });
        },
        submitQuiz: async (lessonId, score) => {
             // Placeholder for now
             return { earned: score > 50 ? 20 : 0 };
        }
    },

    profile: {
        getProfileData: (callback) => {
            fetch(`${API_URL}/user/profile`, { headers: getAuthHeader() })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) callback({ ...data, displayId: data.id });
                });
            return () => {};
        }
    }
};