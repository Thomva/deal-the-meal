import React, { createContext, useContext, useState } from 'react';
import * as jwt from 'jsonwebtoken';
import { apiConfig, JWTConfig } from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

  const verifyUserFromLocalStorage = () => {
    if (JSON.parse(localStorage.getItem('mern:authUser'))) {
      try {
        const token = JSON.parse(localStorage.getItem('mern:authUser')).token;
        if (!token) {
          throw new Error('Token is not present on localstorage!');
        }
        
        const decoded = jwt.verify(token, JWTConfig.JWTSecret);
        if (!decoded) {
          throw new Error('Couldn\'t decode the token!');
        }

        if (decoded.exp > Date.now()) {
          throw new Error('Token is expired!')
        }
        return JSON.parse(localStorage.getItem('mern:authUser'));
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    return null;
  }

  const [currentUser, setCurrentUser] = useState(verifyUserFromLocalStorage);

  const logInLocal = async (email, password) => {
    const url = `${apiConfig.baseURL}/auth/login`;

    const body = {
      email,
      password
    };

    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow'
    };

    const response = await fetch(`${url}`, options);
    const user = await response.json();
    const {error} = user;
    
    if (error) {
      return {error, user: null};
    }

    localStorage.setItem('mern:authUser', JSON.stringify(user));
    setCurrentUser(user);

    return {error, user};
  }

  const signup = async (data) => {
    let url = `${apiConfig.baseURL}/auth/signup`;

    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: 'follow'
    };
    const response = await fetch(`${url}`, options);
    const user = await response.json();

    localStorage.setItem('mern:authUser', JSON.stringify(user));
    setCurrentUser(user);

    return user;
  }

  const logout = async () => {
    localStorage.setItem('mern:authUser', null);
    return true;
  }

  const checkIsAdmin = async (currentUser) => {
    if (!currentUser) return;

    const myHeaders = {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({userId: currentUser.id}),
      // redirect: 'follow'
    };

    // let url = `${apiConfig.baseURL}/auth/${currentUser.id}`;
    let url = `${apiConfig.baseURL}/auth/isadmin/`;
    const response = await fetch(url, options);
    const json = await response.json();
    return json.isAdmin;
  }

  return (
    <AuthContext.Provider value={{ currentUser, logInLocal, signup, logout, checkIsAdmin }}>
      {children}
    </AuthContext.Provider>
  )
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
}