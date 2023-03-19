import React from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import {} from "react-router-dom";
import "./Signin.css";

export default function Signin() {
  const { googleSignIn } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="signin-total">
        <div className="signin-text">Sign In Below</div>
        <GoogleButton
          className="sign-google-link"
          onClick={handleGoogleSignIn}
        />
      </div>
    </>
  );
}
