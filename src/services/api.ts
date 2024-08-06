// src/services/api.ts
import axios from "axios";
import { PaginatedResponse } from "../types";
import { getToken } from "../helpers/authHelper";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/"; // Default value as fallback

export const setToken = (newToken: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
};

export const login = async (username: string, password: string): Promise<string> => {
  const response = await axios.post(`${API_URL}login`, { username, password });
  return response.data.token;
};

export const getItems = async (
  page: number,
  limit: number
): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_URL}items?page=${page}&limit=${limit}`);
  return response.data;
};

export const createItem = async (item: { name: string; price: number }) => {
  const response = await axios.post(`${API_URL}items`, item);
  return response.data;
};

export const updateItem = async (
  id: string,
  item: { name: string; price: number }
) => {
  const response = await axios.put(`${API_URL}items/${id}`, item);
  return response.data;
};

export const deleteItem = async (id: string) => {
  const response = await axios.delete(`${API_URL}items/${id}`);
  return response.data;
};

// Set the token from localStorage if available
const token = getToken();
if (token) {
  setToken(token);
}
