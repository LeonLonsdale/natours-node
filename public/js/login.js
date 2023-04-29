import axios from 'axios';

import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:8080/api/v1/users/logout',
    });
    if (result.data.status === 'success') location.reload(true); //true means reaload from server and not browser cache.
  } catch (err) {
    showAlert('error', 'Error logging out. Try again');
  }
};
