import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth_context';
import { getChatHistory, sendMessage, getAllChats } from '@/services/chat_service';
import { Send, User as UserIcon, MessageCircle, Loader2 } from 'lucide-react';
import { socket } from '@/socket'; 

const ChatPage = () => {
    const { user: currentUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef();
    
    // This Ref is the source of truth for the socket listener
    const activeChatIdRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]); 
    const [activeChatId, setActiveChatId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const activePartner = useMemo(() => {
        return conversations.find(c => c._id === activeChatId)?.partnerDetails;
    }, [conversations, activeChatId]);

    const fetchSidebar = async () => {
        try {
            const data = await getAllChats();
            if (data.success) setConversations(data.chats || []);
        } catch (err) { console.error("Sidebar Error:", err); }
    };

    const loadMessages = async (id) => {
        try {
            const data = await getChatHistory(id);
            setMessages(data.messages || []);
        } catch (err) { console.error("History Error:", err); }
    };

    // 1. Sync State and Ref with URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('partnerId');
        if (id) {
            setActiveChatId(id);
            activeChatIdRef.current = id;
            loadMessages(id);
        }
        fetchSidebar();
    }, [location.search]);

    // 2. STABLE SOCKET LISTENER
    useEffect(() => {
        if (!socket || !currentUser) return;

        // Ensure we are connected and identified
        if (!socket.connected) socket.connect();
        socket.emit('login', currentUser._id || currentUser.id);

        const handleNewMessage = (msg) => {
            console.log("Live Message Received:", msg);

            // Extract IDs safely
            const msgSenderId = (msg.sender?._id || msg.sender)?.toString();
            const msgReceiverId = (msg.receiver?._id || msg.receiver)?.toString();
            const openChatId = activeChatIdRef.current?.toString();

            // Only append to screen if the message belongs to the current conversation
            if (msgSenderId === openChatId || msgReceiverId === openChatId) {
                setMessages((prev) => {
                    const exists = prev.find(m => m._id === msg._id);
                    return exists ? prev : [...prev, msg];
                });
            }
            
            // Always update sidebar for the last message preview
            fetchSidebar();
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('userStatusChanged', fetchSidebar);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('userStatusChanged', fetchSidebar);
        };
    }, [currentUser]); // Listeners stay alive as long as user is logged in

    // 3. Scroll Management
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const trimmedMsg = newMessage.trim();
        if (!trimmedMsg || !activeChatId || isSending) return;

        setIsSending(true);
        try {
            const data = await sendMessage(activeChatId, trimmedMsg);
            // Local update for sender
            setMessages((prev) => [...prev, data.message]);
            setNewMessage('');
            fetchSidebar();
        } catch (err) {
            console.error("Send error:", err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-50">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r hidden lg:flex flex-col">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-sm">No conversations yet</div>
                    ) : (
                        conversations.map((chat) => (
                            <div 
                                key={chat._id}
                                onClick={() => navigate(`/chat?partnerId=${chat._id}`)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-all border-b ${
                                    activeChatId === chat._id ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''
                                }`}
                            >
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    {chat.partnerDetails?.avatar ? (
                                        <img src={chat.partnerDetails.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold uppercase">
                                            {chat.partnerDetails?.name?.charAt(0)}
                                        </div>
                                    )}
                                    {chat.partnerDetails?.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-sm truncate">{chat.partnerDetails?.name}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChatId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center gap-3 bg-white">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white overflow-hidden">
                                {activePartner?.avatar ? (
                                    <img src={activePartner.avatar} className="w-full h-full object-cover" alt="" />
                                ) : <UserIcon size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{activePartner?.name || 'Loading...'}</h3>
                                <p className={`text-xs ${activePartner?.isOnline ? 'text-green-500 font-medium' : 'text-slate-400'}`}>
                                    {activePartner?.isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f8fafc]">
                            {messages.map((m) => {
                                const mSenderId = (m.sender?._id || m.sender)?.toString();
                                const isMe = mSenderId === (currentUser?._id || currentUser?.id)?.toString();
                                return (
                                    <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                                            isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{m.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Box */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-3 bg-white">
                            <input 
                                className="flex-1 bg-slate-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Write a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={isSending}
                            />
                            <button 
                                type="submit" 
                                disabled={isSending || !newMessage.trim()} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-100 p-6 rounded-full mb-4">
                            <MessageCircle size={48} className="opacity-20" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600">Your Inbox</h3>
                        <p className="text-sm">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;