import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

import "./Navbar.css";

export default function Navbar() {
  //Always loaded, used to link back to account and home page etc
  const { user, googleSignInRed, googleSignInPop } = UserAuth();
  const [accpath, setAccpath] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      if (window.innerWidth < 601) {
        await googleSignInPop();
      } else {
        await googleSignInRed();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.displayName) {
      setAccpath("/Account/" + user.uid);
    }
  }, [user]);

  return (
    <>
      <nav className="navbar-container">
        <ul className="logo-container">
          <div className="navbar-logo">PHHS-Study</div>
        </ul>
        <ul className="navbar-bar">
          <li className="navbar-link home-link">
            <Link className="navbar-link-real" to="/Home">
              Home
            </Link>
          </li>

          {user?.displayName ? (
            <li className="navbar-link create-link">
              <Link className="navbar-link-real" to="/CreateSet">
                Create Set
              </Link>
            </li>
          ) : (
            <></>
          )}

          <li className="navbar-link search-link">
            <Link className="navbar-link-real" to="/Search">
              Search
            </Link>
          </li>

          <li className="navbar-link accsign-link">
            {user?.displayName ? (
              <Link className="navbar-link-real" to={accpath}>
                Account
              </Link>
            ) : (
              <div className="navbar-link-real" onClick={handleGoogleSignIn}>
                Sign In
              </div>
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
