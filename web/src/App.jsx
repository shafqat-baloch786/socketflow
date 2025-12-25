import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/auth_context';

// Layout Components
import Navbar from '@/components/navbar';

// Pages
import LoginPage from '@/pages/login_page';
import RegisterPage from '@/pages/register_page';
import ChatPage from '@/pages/chat_page';
import ProfilePage from '@/pages/profile_page';
import UsersPage from '@/pages/users_page'; // The "all users" dashboard

// Helper for protected routes
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    // Optional: Add a loading spinner if your AuthContext tracks initial load
    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    
    return user ? (
        <>
            <Navbar /> {/* Show Navbar only for logged-in users */}
            <main className="min-h-[calc(100vh-64px)] bg-slate-50">
                {children}
            </main>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/users" element={
                        <PrivateRoute><UsersPage /></PrivateRoute>
                    } />
                    
                    <Route path="/chat" element={
                        <PrivateRoute><ChatPage /></PrivateRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <PrivateRoute><ProfilePage /></PrivateRoute>
                    } />

                    {/* Default Redirects */}
                    <Route path="/" element={<Navigate to="/profile" />} />
                    <Route path="*" element={<Navigate to="/profile" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;