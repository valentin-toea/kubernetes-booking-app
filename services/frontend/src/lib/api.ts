import axios, { InternalAxiosRequestConfig } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDynamicConfig = (config: InternalAxiosRequestConfig<any>) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(createDynamicConfig, (error) => {
  return Promise.reject(error);
});

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

backendApi.interceptors.request.use(createDynamicConfig, (error) => {
  return Promise.reject(error);
});

export { authApi, backendApi };
