import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    if (!authState.status) {
      navigate('/login');
    }
  }, []);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const changePassword = () => {
    if (oldPassword !== newPassword) {
      axios
        .put(
          'http://localhost:3006/auth/changepassword',
          { oldPassword: oldPassword, newPassword: newPassword },
          { headers: { accessToken: sessionStorage.getItem('accessToken') } },
        )
        .then((response) => {
          alert(response.data);
          setOldPassword('');
          setNewPassword('');
        });
    } else {
      alert('your new password is the same with the old one');
    }
  };
  return (
    <div>
      <h1>Change your password</h1>
      <input
        value={oldPassword}
        placeholder="Old password"
        type="password"
        onChange={(e) => {
          setOldPassword(e.target.value);
        }}
      ></input>
      <input
        value={newPassword}
        placeholder="New password"
        type="password"
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      ></input>
      <button onClick={changePassword}>Save changes</button>
    </div>
  );
}

export default ChangePassword;
