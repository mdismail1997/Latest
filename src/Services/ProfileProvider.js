import React, {createContext, useState} from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({children}) => {
  const [profileContextData, setProfileContextData] = useState('');
  const [token, setToken] = useState('');
  const [cartCount, setCartCount] = useState(0);

  return (
    <ProfileContext.Provider
      value={{
        profileContextData,
        setProfileContextData,
        token,
        setToken,
        cartCount,
        setCartCount,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export {ProfileContext, ProfileProvider};
