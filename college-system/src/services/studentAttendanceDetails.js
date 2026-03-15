import axios from "axios";

const BASE_URL = "/api/v1";

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

const getAuthHeaders = () => ({
	Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
});

export const getStudentAttendanceHistory = async () => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		const authError = new Error("Authentication required");
		authError.status = 401;
		throw authError;
	}

	const response = await api.get("/attendance/my-history", {
		headers: {
			...getAuthHeaders(),
			Authorization: `Bearer ${token}`,
		},
	});

	return response.data?.data || response.data;
};

