import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../helpers/AuthContext';

function Profile() {
  const { authState } = useContext(AuthContext);
  const usename = '';
  const userPosts = [];
  useEffect(() => {}, []);
  return (
    <div>
      <h1>Proflie</h1>
    </div>
  );
}

export default Profile;
