import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

//Wrap this around a component and it will protect it from being accessed if the user is not signed in
const CheckSignedIn = ({ children }) => {
  const { user } = UserAuth();
  if (user?.displayName) {
    return <Navigate to={"/Account/" + user.uid} />;
  }
  return children;
};

export default CheckSignedIn;
