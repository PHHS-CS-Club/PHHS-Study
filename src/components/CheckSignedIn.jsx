import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const CheckSignedIn = ({ children }) => {
  const { user } = UserAuth();
  if (user?.displayName) {
    return <Navigate to={"/Account/" + user.uid} />;
  }

  return children;
};

export default CheckSignedIn;
