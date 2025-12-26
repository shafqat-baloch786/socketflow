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

/**
 * SocketHandler handles real-time presence.
 * - Connects/Identifies when the app is active and visible.
 * - Disconnects when the user leaves the tab or closes the site.
 */
const SocketHandler = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            const userId = user._id || user.id;

            const handlePresence = () => {
                // 'visible' means the user is looking at your website tab
                if (document.visibilityState === 'visible') {
                    if (!socket.connected) {
                        console.log("Tab Active: Connecting Socket...");
                        socket.connect();
                    }
                } else {
                    // 'hidden' means they switched tabs or minimized the browser
                    console.log("Tab Hidden: Disconnecting for Presence...");
                    socket.disconnect();
                }
            };

            const identify = () => {
                if (socket.id) {
                    console.log(`Presence: User ${userId} is now Online`);
                    socket.emit('login', userId);
                }
            };

            // Setup listeners
            socket.on('connect', identify);
            document.addEventListener('visibilitychange', handlePresence);

            // Initial Action
            if (document.visibilityState === 'visible') {
                socket.connect();
            }

            // Cleanup on Unmount or Logout
            return () => {
                console.log("Cleaning up presence listeners");
                socket.off('connect', identify);
                document.removeEventListener('visibilitychange', handlePresence);
                socket.disconnect();
            };
        } else {
            // Disconnect if user logs out manually
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