import axios from 'axios';

const RECOMMENDATION_API_BASE_URL = 'http://localhost:8000';
const HEALTH_CHECK_TIMEOUT = 20000;

export const checkRecommendationModelHealth = async () => {
    try {
        const response = await axios.post(
            `${RECOMMENDATION_API_BASE_URL}/recommend`,
            { query: 'recommend 1 beginner course for python' },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: HEALTH_CHECK_TIMEOUT,
            }
        );

        return (
            response.status === 200 &&
            typeof response.data?.message === 'string' &&
            Array.isArray(response.data?.courses)
        );
    } catch (error) {
        return false;
    }
};

export const getCourseRecommendations = async (query) => {
    try {
        const response = await axios.post(
            `${RECOMMENDATION_API_BASE_URL}/recommend`,
            { query },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 120000,
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching course recommendations:', error);
        throw error;
    }
};
