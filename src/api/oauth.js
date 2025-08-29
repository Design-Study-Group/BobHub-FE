import {
  DeleteAxiosInstance,
  GetAxiosInstance,
  PostAxiosInstance,
} from '../axios/AxiosMethod';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getRefresh = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/refresh`);
    return res;
  } catch (e) {
    console.error(e);
    throw e; // 에러를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 함
  }
};

export const getUserProfile = async () => {
  try {
    const res = await GetAxiosInstance('/api/user/profile');
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const getUserActivity = async () => {
  try {
    const res = await GetAxiosInstance('/api/user/activity');
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = async () => {
  try {
    const res = await DeleteAxiosInstance('/api/user/delete');
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