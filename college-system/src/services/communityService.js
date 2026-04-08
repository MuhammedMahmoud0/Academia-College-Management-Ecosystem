import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be invalid or expired');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('message');
      localStorage.removeItem('currentUser');
    }
    return Promise.reject(error);
  }
);

/**
 * Get community feed with all posts
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise} Promise with posts data
 */
export const getCommunityFeed = async (page = 1, limit = 20) => {
  const response = await api.get('/community/feed', {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Get suggested groups for the user
 * @returns {Promise} Promise with suggested groups data
 */
export const getSuggestedGroups = async () => {
  const response = await api.get('/community/groups/suggested');
  return response.data;
};

/**
 * Get all upcoming community events
 * @returns {Promise} Promise with events data
 */
export const getCommunityEvents = async () => {
  const response = await api.get('/community/events');
  return response.data;
};

/**
 * Create a new community event
 * @param {Object} eventData - Event payload
 * @param {string} eventData.title - Event title
 * @param {string} eventData.event_date - Event date (YYYY-MM-DD)
 * @param {string} eventData.time - Event time (HH:mm)
 * @param {string} eventData.location - Event location
 * @param {string} [eventData.img_url] - Optional image URL
 * @param {string} [eventData.link] - Optional event link
 * @param {string} [eventData.description] - Optional event description
 * @returns {Promise} Promise with created event data
 */
export const createCommunityEvent = async (eventData) => {
  const response = await api.post('/community/events', eventData);
  return response.data;
};

/**
 * Update an existing community event
 * @param {number|string} eventId - Event ID
 * @param {Object} eventData - Event payload
 * @param {string} eventData.title - Event title
 * @param {string} eventData.event_date - Event date (YYYY-MM-DD)
 * @param {string} eventData.time - Event time (HH:mm)
 * @param {string} eventData.location - Event location
 * @param {string} [eventData.img_url] - Optional image URL
 * @param {string} [eventData.link] - Optional event link
 * @param {string} [eventData.description] - Optional event description
 * @returns {Promise} Promise with updated event data
 */
export const updateCommunityEvent = async (eventId, eventData) => {
  const response = await api.patch(`/community/events/${eventId}`, eventData);
  return response.data;
};

/**
 * Delete a community event
 * @param {number|string} eventId - Event ID
 * @returns {Promise} Promise with delete result
 */
export const deleteCommunityEvent = async (eventId) => {
  const response = await api.delete(`/community/events/${eventId}`);
  return response.data;
};

/**
 * Get groups that the current user has joined
 * @returns {Promise} Promise with user's groups data
 */
export const getMyGroups = async () => {
  const response = await api.get('/community/groups/my');
  return response.data;
};

/**
 * Get posts for a specific community group
 * @param {number|string} groupId - Group ID
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise} Promise with group posts data
 */
export const getGroupPosts = async (groupId, page = 1, limit = 10) => {
  const response = await api.get(`/community/groups/${groupId}/posts`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Create a new community group
 * @param {Object} groupData - Group payload
 * @param {string} groupData.name - Group name
 * @param {string} groupData.description - Group description
 * @param {string} [groupData.avatar_url] - Optional avatar URL
 * @returns {Promise} Promise with created group data
 */
export const createGroup = async (groupData) => {
  const response = await api.post('/community/groups', groupData);
  return response.data;
};

/**
 * Join a community group
 * @param {number|string} groupId - Group ID to join
 * @returns {Promise} Promise with join result
 */
export const joinCommunityGroup = async (groupId) => {
  const response = await api.post(`/community/groups/${groupId}/join`);
  return response.data;
};


/**
 * Update an existing community group
 * @param {number|string} groupId - Group ID
 * @param {Object} groupData - Group payload
 * @param {string} groupData.name - Group name
 * @param {string} groupData.description - Group description
 * @param {string} [groupData.avatar_url] - Optional avatar URL
 * @returns {Promise} Promise with updated group data
 */
export const updateGroup = async (groupId, groupData) => {
  const response = await api.patch(`/community/groups/${groupId}`, groupData);
  return response.data;
};

/**
 * Delete a community group
 * @param {number|string} groupId - Group ID
 * @returns {Promise} Promise with delete result
 */
export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/community/groups/${groupId}`);
  return response.data;
};

/**
 * Toggle like on a post
 * @param {number} postId - The ID of the post to like/unlike
 * @returns {Promise} Promise with like status data
 */
export const likePost = async (postId) => {
  const response = await api.post(`/community/posts/${postId}/like`);
  return response.data;
};

/**
 * Add a comment to a post
 * @param {number} postId - The ID of the post to comment on
 * @param {string} content - The comment text
 * @returns {Promise} Promise with the created comment data
 */
export const addComment = async (postId, content) => {
  const response = await api.post(`/community/posts/${postId}/comment`, { content });
  return response.data;
};

/**
 * Create a new community post
 * @param {Object} postData - Post payload
 * @param {string} postData.content - Post content
 * @param {string} [postData.image_url] - Optional post image URL
 * @param {number|string} [postData.group_id] - Optional group ID
 * @returns {Promise} Promise with created post data
 */
export const createCommunityPost = async (postData) => {
  const response = await api.post('/community/posts', postData);
  return response.data;
};

/**
 * Get all posts by a specific user
 * @param {string} userId - User ID whose posts to retrieve
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise} Promise with user posts data
 */
export const getUserPosts = async (userId, page = 1, limit = 10) => {
  const response = await api.get(`/community/posts/user/${userId}`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get all comments for a post
 * @param {number} postId - The ID of the post
 * @returns {Promise} Promise with comments data { post_id, comments, total }
 */
export const getPostComments = async (postId) => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};

/**
 * Update an existing community post
 * @param {number|string} postId - Post ID
 * @param {Object} postData - Post payload
 * @param {string} [postData.content] - Updated post content
 * @param {string} [postData.image_url] - Updated image URL
 * @returns {Promise} Promise with updated post data
 */
export const updatePost = async (postId, postData) => {
  const response = await api.patch(`/community/posts/${postId}`, postData);
  return response.data;
};

/**
 * Delete a community post
 * @param {number|string} postId - Post ID
 * @returns {Promise} Promise with delete result
 */
export const deletePost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}`);
  return response.data;
};

export default {
  getCommunityFeed,
  getSuggestedGroups,
  getCommunityEvents,
  createCommunityEvent,
  updateCommunityEvent,
  deleteCommunityEvent,
  getMyGroups,
  getGroupPosts,
  createGroup,
  joinCommunityGroup,
  updateGroup,
  deleteGroup,
  likePost,
  addComment,
  createCommunityPost,
  getUserPosts,
  getPostComments,
  updatePost,
  deletePost
};
