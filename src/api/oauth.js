import {
  DeleteAxiosInstance,
  GetAxiosInstance,
  PostAxiosInstance,
  PutAxiosInstance,
} from '../axios/AxiosMethod';

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

export const updateUserProfile = async (userData) => {
  try {
    const res = await PutAxiosInstance('/api/user/profile', userData);
    return res;
  } catch (e) {
    console.error('Failed to update user profile', e);
    throw e;
  }
};