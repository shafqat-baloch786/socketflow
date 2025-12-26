import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/auth_context';
import { socket } from '@/socket';

// Layout Components
import Navbar from '@/components/navbar';

// Pages
import LoginPage from '@/pages/login_page';
import RegisterPage from '@/pages/register_page';
import ChatPage from '@/pages/chat_page';
import ProfilePage from '@/pages/profile_page';
import UsersPage from '@/pages/users_page';

// INDUSTRY STANDARD: Global Socket Controller
// This ensures the user is marked 'Online' regardless of the page they are on.
const SocketHandler = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Only attempt connection if we have a valid authenticated user
        if (isAuthenticated && user) {
            const userId = user._id || user.id;

            // 1. Establish initial connection
            if (!socket.connected) {
                socket.connect();
            }

            // 2. The Identity Handshake
            // This function is defined separately so it can be reused
            const identify = () => {
                console.log(`Socket connected. Identifying user: ${userId}`);
                socket.emit('login', userId);
            };

            // If already connected, identify immediately
            if (socket.connected) identify();

            // 3. Setup listeners for connection lifecycle
            socket.on('connect', identify);

            // Optional: Global listeners (e.g., if you want to show a toast for new messages)
            // socket.on('newMessage', (msg) => { ... });

            return () => {
                console.log("Cleaning up global socket listeners");
                socket.off('connect', identify);
                socket.disconnect();
            };
        } else {
            // If user logs out, disconnect socket immediately
            if (socket.connected) socket.disconnect();
        }
    }, [user, isAuthenticated]);

    return children;
};

// Helper for protected routes
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-slate-500 font-medium">Loading session...</p>
            </div>
        );
    }
    
    return user ? (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)] bg-slate-50">
                {children}
            </main>
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

function App() {
    return (
        <AuthProvider>
            <SocketHandler>
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
                        <Route path="/" element={<Navigate to="/profile" replace />} />
                        <Route path="*" element={<Navigate to="/profile" replace />} />
                    </Routes>
                </BrowserRouter>
            </SocketHandler>
        </AuthProvider>
    );
}

export default App;