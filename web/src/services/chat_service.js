import apiClient from '@/utils/api_client';

/**
 * Fetch a list of all recent conversations for the sidebar
 * Hits: GET /api/chat/all-chats
 */
export const getAllChats = async () => {
    try {
        const response = await apiClient.get('/chat/all-chats');
        return response.data;
    } catch (error) {
        console.error("Error in getAllChats service:", error);
        throw error;
    }
};

/**
 * Fetch chat history with a specific person
 * Hits: GET /api/chat/:partnerId
 */
export const getChatHistory = async (partnerId) => {
    try {
        const response = await apiClient.get(`/chat/${partnerId}`);
        return response.data;
    } catch (error) {
        console.error("Error in getChatHistory service:", error);
        throw error;
    }
};

/**
 * Send a new message to a specific person
 * Hits: POST /api/chat/:partnerId
 */
export const sendMessage = async (partnerId, content) => {
    try {
        const response = await apiClient.post(`/chat/${partnerId}`, { content });
        return response.data;
    } catch (error) {
        console.error("Error in sendMessage service:", error);
        throw error;
    }
};