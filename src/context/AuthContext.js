import { useContext, createContext, useEffect, useState } from "react";
import {
  /* eslint-disable no-unused-vars */
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  /* eslint-enable no-unused-vars */
} from "firebase/auth";

import { auth } from "../firebase-config";

const AuthContext = createContext();

//provides the user, signin function, logout function across the website.
//access them by importing { UserAuth }, and then simply write const { user } = UserAuth(); and the user will have the signed in user's information
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignInRed = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const googleSignInPop = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ googleSignInRed, googleSignInPop, logOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
