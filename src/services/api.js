const API_URL = "/api"; 

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to process failed responses aggressively
const handleFailedResponse = async (res, action) => {
    let errorDetail = `Failed to ${action} (Status: ${res.status})`;
    
    try {
        // Try to parse JSON for detailed error message (FastAPI standard)
        const data = await res.json();
        errorDetail = data.detail || errorDetail;
    } catch (e) {
        // If JSON parsing fails (e.g., Vercel 500 HTML page)
        // Try to get the raw text, but limit it to prevent huge alerts
        const text = await res.text();
        errorDetail = `${errorDetail}. Server response: ${text.substring(0, 100)}... (Check Vercel logs)`;
    }
    
    alert(`${action} Failed: ${errorDetail}`); 
    throw new Error(errorDetail);
}

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!res.ok) {
                await handleFailedResponse(res, 'Login');
            }
            
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
            
            if (!res.ok) {
                await handleFailedResponse(res, 'Signup');
            }
            
            const data = await res.json();
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