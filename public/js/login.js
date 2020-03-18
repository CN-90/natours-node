/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log('Running');
  let res = null;
  try {
    res = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/users/logout');
    if (res.data.status === 'Success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Please try again.');
  }
};
