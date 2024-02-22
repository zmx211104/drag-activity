import global from '@/components/Global'
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import SettingMer from '@/utils/settingMer';
const service = axios.create({
  baseURL: SettingMer.apiBaseURL,
  timeout: 60000, // 过期时间
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 发送请求之前做的
   const token = localStorage.getItem('token');
  //  const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiMCIsInN5c0lkIjoiMWNhYjI3ZGVmOGZiNGMwZjk0ODZkY2Y4NDRiNzgzYzAiLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbIm9wZW5pZCJdLCJleHAiOjE2OTMzNjM0OTgsIm1lc3NhZ2UiOiJzdWNjZXNzIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI4ZTUxM2M3NC0yMDFhLTQzNjUtYmZhOS1mMzc3OTUzM2RmNTYiLCJjbGllbnRfaWQiOiJ3ZWJfYXBwIn0.gf4LX4A6LkLArcnP1OMzCsUJCERjUrQdH7RW00oa2dvfPk5dY-3qBcfxHuSPvuQWileuOu2J95ap0fc09c5kboXgEioCjcNUOytSd9i88057RGoHruVuIaEVO9HiGHSWfNDqrRnPjAW7xolIJDhhOgLmAn-sF7YRECs7sPX688PjDJvX3Ux8jpkofRpS8jF8ow-a60bN1Hi1BjvkVr9JMFp2Q1bLDD897gejmkwNyCBQFiQOI7lg6JT2ReF-dl7mf58Wkz7z2-ohegMOFRoEPKO9pHXy0-laGP4Wz46aw62BiTnk7FRbsPV6pdtTJoIlKdhT6viabDvH0Ee4ONLf1w'
	if (token) {
      config.headers['Authorization'] = token;
    }
    if (/get/i.test(config.method)) {
      config.params = config.params || {};
      config.params.temp = Date.parse(new Date()) / 1000;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 401) {
      // to re-login
      Message.error('无效的会话，或者登录已过期，请重新登录。');
     // if (window.location.pathname !== '/login') location.href = '/login';
      window.localStorage.clear();
    } else if (res.code === 403) {
      Message.error('没有权限访问。');
    }
    if (res.code !== 0 && res.code !== 401 && res.ec !== "0" && res.code !== "0") {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject();
    } else {
      return res;
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
