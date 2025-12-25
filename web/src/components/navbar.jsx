import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth_context';
import { MessageSquare, Search, User, LogOut, ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Don't show navbar if user is not logged in
    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to highlight active link
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-slate-100 h-16 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                {/* Logo & Main Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/profile" className="flex items-center gap-2 group">
                        <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                            <MessageSquare className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                            SOCKETFLOW
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {/* Dashboard / All Users Link */}
                        <Link 
                            to="/users" 
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                isActive('/users') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Users size={18} />
                            Explore
                        </Link>

                        <Link 
                            to="/chat" 
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                isActive('/chat') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <MessageSquare size={18} />
                            Chats
                        </Link>
                    </div>
                </div>

                {/* Profile Dropdown / Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-200 transition-all outline-none"
                        >
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                                alt="me" 
                            />
                            <span className="hidden sm:block text-sm font-bold text-slate-700">{user.name}</span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                {/* Invisible backdrop to close menu when clicking outside */}
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Account</p>
                                    </div>
                                    
                                    <Link 
                                        to="/profile" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                                            isActive('/profile') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <User size={16} /> My Profile
                                    </Link>

                                    <hr className="my-1 border-slate-50" />
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;