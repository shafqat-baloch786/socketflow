import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth_context';
import { getChatHistory, sendMessage } from '@/services/chat_service';
import { Send, User as UserIcon, MessageCircle, Loader2 } from 'lucide-react';

const ChatPage = () => {
    const { user: currentUser } = useAuth();
    const location = useLocation();
    const scrollRef = useRef();

    const [messages, setMessages] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Get partnerId from URL (e.g., /chat?partnerId=123)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('partnerId');
        if (id) {
            setActiveChatId(id);
            loadMessages(id);
        }
    }, [location]);

    const loadMessages = async (id) => {
        try {
            const data = await getChatHistory(id);
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        
        // Don't send if empty, no partner selected, or already sending
        if (!newMessage.trim() || !activeChatId || isSending) return;

        setIsSending(true);
        try {
            const data = await sendMessage(activeChatId, newMessage);
            
            // Add the new message returned from backend to the list
            setMessages((prev) => [...prev, data.message]);
            setNewMessage(''); // Clear input
        } catch (err) {
            console.error("Send error:", err);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-50">
            {/* Sidebar (Recent/Contacts) */}
            <div className="w-1/4 bg-white border-r hidden lg:flex flex-col">
                <div className="p-5 border-b bg-white">
                    <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 text-center">
                    <p className="text-sm text-slate-400">Recent chats will appear here.</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChatId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Chatting Partner</h3>
                                    <p className="text-xs text-green-500 font-medium">Online</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Message List */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f8fafc]">
                            {messages.map((m) => {
                                // Handles both .id and ._id formats depending on your backend
                                const isMe = m.sender === currentUser?.id || m.sender === currentUser?._id;
                                
                                return (
                                    <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2.5 shadow-sm transition-all ${
                                            isMe 
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none'
                                        }`}>
                                            <p className="text-[15px] leading-relaxed">{m.content}</p>
                                            <span className={`text-[10px] block mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 bg-white border-t flex items-center gap-3">
                            <input 
                                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Write a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSending}
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={isSending || !newMessage.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSending ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <div className="bg-white p-8 rounded-full shadow-xl mb-6">
                            <MessageCircle size={64} className="text-indigo-100" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-600">No Chat Selected</h3>
                        <p className="text-sm">Find someone to talk to in the Explore page!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;