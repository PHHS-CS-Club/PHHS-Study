import React from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  //Always loaded, used to link back to account and home page etc
  const { user } = UserAuth();
  return (
    <>
      <nav>
        <ul class="navbar-header">
          <li class="navbar-link-to-home">
            <Link to="/Home">Home</Link>
          </li>
          <li class="navbar-link-to-signin-account">
            {user?.displayName ? (
              <Link to="/Account">Account</Link>
            ) : (
              <Link to="SignIn">Sign In</Link>
            )}
          </li>
          <li class="navbar-filler">filler</li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
