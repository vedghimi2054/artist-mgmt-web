import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const logout = () => {
    
    localStorage.removeItem('user');
  };


  return (
    <AuthContext.Provider value={{ user , logout}}>
      {children}
    </AuthContext.Provider>
  );
};

