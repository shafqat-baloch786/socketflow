import apiClient from '@/utils/api_client';

/**
 * Fetch all users from the community (the allUsers controller)
 * Maps to GET /api/users
 */
export const getAllUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data;
};

/**
 * Search users by name or email
 * Maps to GET /api/users/search?query=...
 */
export const searchUsers = async (query) => {
    const response = await apiClient.get(`/users/search?query=${query}`);
    return response.data;
};

/**
 * Fetch the logged-in user's profile
 * Maps to GET /api/profile
 */
export const getProfile = async () => {
    const response = await apiClient.get('/profile');
    return response.data;
};

/**
 * Update the logged-in user's profile
 * Maps to PATCH /api/edit-profile
 */
export const updateProfile = async (userData) => {
    const response = await apiClient.patch('/edit-profile', userData);
    return response.data;
};