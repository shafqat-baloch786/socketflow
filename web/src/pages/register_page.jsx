import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/auth_context';
import { registerUser } from '@/services/auth_service';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await registerUser(formData);
            // login function sets user and token in state and localStorage
            login(data.user, data.token);
            
            // Redirecting directly to profile as requested
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 text-sm mt-1">Join SocketFlow and start chatting</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 ml-1 mb-1 block">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 ml-1 mb-1 block">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900"
                                placeholder="john@example.com"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 ml-1 mb-1 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex justify-center items-center disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;