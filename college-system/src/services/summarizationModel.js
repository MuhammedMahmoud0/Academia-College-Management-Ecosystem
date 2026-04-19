import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const checkModelHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export const summarizePdfStructured = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/summarize/upload/structured`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error summarizing PDF:", error);
        throw error;
    }
};
