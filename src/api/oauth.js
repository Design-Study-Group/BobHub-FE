import {
  DeleteAxiosInstance,
  GetAxiosInstance,
  PostAxiosInstance,
} from '../axios/AxiosMethod';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getRefresh = async (refresh) => {
  try {
    const res = await axios.get(`${baseURL}/refresh`, {
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const getUserData = async () => {
  try {
    const res = await GetAxiosInstance('/user/mypage');
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = async () => {
  try {
    const res = await DeleteAxiosInstance('/user/delete');
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const logoutUser = async () => {
  try {
    const res = await PostAxiosInstance('/api/auth/logout', {});
    return res;
  } catch (e) {
    console.error('Logout failed', e);
    throw e;
  }
};