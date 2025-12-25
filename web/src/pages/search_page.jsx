import { useState } from 'react';
import { searchUsers } from '../assets/services/user_service';
import { Search as SearchIcon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        try {
            const data = await searchUsers(query);
            setResults(data.users);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Find People</h1>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-10">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button className="bg-indigo-600 text-white px-8 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((user) => (
                    <div key={user._id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <img 
                                src={user.avatar || 'https://via.placeholder.com/50'} 
                                className="w-12 h-12 rounded-full object-cover"
                                alt={user.name}
                            />
                            <div>
                                <h3 className="font-bold text-gray-800">{user.name}</h3>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(`/chat?partnerId=${user._id}`)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"
                        >
                            <MessageSquare size={20} />
                        </button>
                    </div>
                ))}
                
                {results.length === 0 && query && (
                    <div className="col-span-2 text-center py-20 text-gray-400">
                        No users found matching "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;