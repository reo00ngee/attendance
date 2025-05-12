import axios from 'axios'
import type { User } from '../types/User'
import { exit } from 'process'

export const getUser = async () => {
  const { data } = await axios.get<User>(`${process.env.REACT_APP_BASE_URL}api/user`, { withCredentials: true });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const login = async ({ email, password }: {
  email: string,
  password: string
}) => {
  const { data } = await axios.post<User>(
    `${process.env.REACT_APP_BASE_URL}api/login`, { email, password }, { withCredentials: true }
  );
  return data;
};

export const logout = async () => {
  const { data } = await axios.post<User>(`${process.env.REACT_APP_BASE_URL}api/logout`, {}, { withCredentials: true });
  return data;
};