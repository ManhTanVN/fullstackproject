import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import './Custom.css';
import {
  BrowserRouter as Router,
  Routes, // instead of "Switch"
  Route,
  Link,
} from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';

import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [authState, setAuthState] = useState({
    username: '',
    id: 0,
    status: typeof sessionStorage.getItem('accessToken') === 'string',
  });
  useEffect(() => {
    axios
      .get('http://localhost:3006/auth/auth', { headers: { accessToken: sessionStorage.getItem('accessToken') } })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({ username: response.data.username, id: response.data.id, status: true });
        }
      });
  }, []);

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, status: false });
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/"> Home Page</Link>
            <Link to="/createpost"> Create A Post</Link>
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            ) : (
              <>
                <div className="loggedInContainer">
                  <h1>{authState.username}</h1>
                  <button onClick={logout}>Logout</button>
                </div>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" exact element={<Registration />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
