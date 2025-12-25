import apiClient from '@/utils/api_client';

/**
 * Fetch chat history
 * Now hits: GET /api/chat/:partnerId
 */
export const getChatHistory = async (partnerId) => {
    const response = await apiClient.get(`/chat/${partnerId}`);
    return response.data;
};

/**
 * Send a message
 * Now hits: POST /api/chat/:partnerId
 */
export const sendMessage = async (partnerId, content) => {
    const response = await apiClient.post(`/chat/${partnerId}`, { content });
    return response.data;
};