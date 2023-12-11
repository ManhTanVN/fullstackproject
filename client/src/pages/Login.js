import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    const data = { username: username, password: password };
    axios.post('http://localhost:3006/auth/login', data).then((response) => {
      if (response.data.error) {
        alert('Your username or password is wrong! \nPlease register first if you do not have any account');
      } else {
        sessionStorage.setItem('accessToken', response.data.token);
        setAuthState({ username: response.data.username, id: response.data.id, status: true });
        navigate('/');
      }
    });
  };
  return (
    <form className="loginContainer" onSubmit={login}>
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}>Login</button>
    </form>
  );
}

export default Login;
