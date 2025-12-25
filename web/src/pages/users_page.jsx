import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '@/services/user_service';
import { MessageSquare, Users, Loader2, Search } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data.users || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Filter users locally for better performance
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="mt-4 text-slate-500 font-medium">Finding people...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Users className="text-indigo-600" />
                        Explore Community
                    </h1>
                    <p className="text-slate-500 mt-1">Connect with {users.length} members on SocketFlow</p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUsers.map((user) => (
                        <div 
                            key={user._id} 
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <img 
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                        className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
                                        alt={user.name}
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900 truncate w-full">{user.name}</h3>
                                <p className="text-sm text-slate-500 truncate w-full mb-6">{user.email}</p>
                                
                                <button 
                                    onClick={() => navigate(`/chat?partnerId=${user._id}`)}
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                                >
                                    <MessageSquare size={18} />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No users found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default UsersPage;