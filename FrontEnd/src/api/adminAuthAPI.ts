import axios from 'axios'

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export const getAdmin = async (): Promise<Admin> => {
  const { data } = await axios.get<Admin>(`${process.env.REACT_APP_BASE_URL}api/admin/me`, { withCredentials: true });
  localStorage.setItem('admin', JSON.stringify(data));
  return data;
};

export const adminLogin = async ({ email, password }: {
  email: string,
  password: string
}): Promise<{ admin: Admin }> => {
  const { data } = await axios.post<{ admin: Admin }>(
    `${process.env.REACT_APP_BASE_URL}api/admin/login`, 
    { email, password }, 
    { withCredentials: true }
  );
  return data;
};

export const adminLogout = async (): Promise<void> => {
  await axios.post(
    `${process.env.REACT_APP_BASE_URL}api/admin/logout`,
    {},
    { withCredentials: true }
  );
  localStorage.removeItem('admin');
};
