import axios from 'axios';

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
      alert('Logged in successfully');
      window.setTimeout(() => location.assign('/'), 1500);
    }

    console.log(result);
  } catch (err) {
    alert(err.response.data.message);
  }
};
