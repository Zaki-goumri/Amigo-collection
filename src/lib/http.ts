import axios from "axios";

export const http = axios.create({ baseURL: "/" });

http.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
		"Accept": "application/json",
		"Content-Type": config.headers?.["Content-Type"] || "application/json",
	};
	return config;
});

http.interceptors.response.use(
	(resp) => resp,
	(error) => {
		console.error("API error", error);
		return Promise.reject(error);
	}
); 