import api from '../utils/api';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function useAuth() {

  async function Register(user) {

    try {
      const data = await api.post('users/register', user).then((response) => {
        return response.data;
      })
    } catch (err) {
      console.log(err);
    }
  }

  return { Register }

}