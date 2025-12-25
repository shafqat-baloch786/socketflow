import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth_context';
import { getProfile, updateProfile } from '@/services/user_service';
import { Camera, Save, Loader2, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    const { setUser } = useAuth();
    // Initialize with empty strings to prevent "uncontrolled to controlled" component warnings
    const [formData, setFormData] = useState({ name: '', email: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Fetch the actual profile from DB when the page loads
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                // We populate the entire form, including the email
                setFormData({
                    name: data.user.name || '',
                    email: data.user.email || '', 
                    avatar: data.user.avatar || ''
                });
                setUser(data.user); 
            } catch (err) {
                setStatus({ type: 'error', msg: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', msg: '' });

        try {
            // formData still contains the email, so the backend request is complete
            const res = await updateProfile(formData);
            setUser(res.user);
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
            // Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
            <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Decorative Header */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="px-8 pb-10">
                    {/* Avatar Section */}
                    <div className="relative -top-12 flex justify-center">
                        <div className="relative group">
                            <img 
                                src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
                                className="w-28 h-28 rounded-3xl border-4 border-white object-cover bg-slate-100 shadow-lg"
                                alt="Profile"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 -mt-4">
                        <div className="grid grid-cols-1 gap-5">
                            {/* Name Input */}
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 ml-1 mb-1 block">Display Name</label>
                                <input 
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            {/* Email Input (Read Only) */}
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 ml-1 mb-1 block">Email Address</label>
                                <input 
                                    className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-400 cursor-not-allowed font-medium"
                                    value={formData.email}
                                    readOnly // User cannot edit, but stays in state
                                    tabIndex="-1" // Skip tabbing to this field
                                />
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">Email is linked to your account and cannot be changed.</p>
                            </div>

                            {/* Avatar URL Input */}
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 ml-1 mb-1 block">Avatar Image URL</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                    placeholder="https://example.com/photo.jpg"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Status Messages */}
                        {status.msg && (
                            <div className={`flex items-center gap-2 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
                                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {status.type === 'success' && <CheckCircle size={18} />}
                                {status.msg}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            disabled={saving}
                            type="submit" 
                            className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {saving ? "Saving Changes..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;