import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: 'http://localhost:8080/api/v1/users/update-me',
      data: {
        name,
        email,
      },
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Details successfully updated');
    }
  } catch (error) {
    showAlert('error', err.response.data.message);
  }
};
