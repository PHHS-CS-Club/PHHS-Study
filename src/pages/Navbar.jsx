import React from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  //Always loaded, used to link back to account and home page etc
  const { user } = UserAuth();
  return (
    <>
      <nav class="navbar-outmost-nav">
        <ul class="navbar-header">
          <Link class="navbar-link-to-home" to="/Home">
            <li class="navbar-to-home">Home</li>
          </Link>
          {user?.displayName ? (
            <Link class="navbar-link-to-account" to="/Account">
              <li class="navbar-to-signin-account">Account</li>
            </Link>
          ) : (
            <Link class="navbar-link-to-signin" to="SignIn">
              <li class="navbar-to-signin-account">Sign In</li>
            </Link>
          )}
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
