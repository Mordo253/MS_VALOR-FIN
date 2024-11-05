import { API_URL } from "../config";
import axios from "./axios";

export const loginRequest = async (user) => {
  return await axios.post(`${API_URL}/auth/login`, user, {
    withCredentials: true
  });
};

export const verifyTokenRequest = async () => {
  return await axios.get(`${API_URL}/auth/verify`, {
    withCredentials: true
  });
};