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
          <li class="navbar-link-to-home">
            <Link class="navbar-link-to-home" to="/Home">
              Home
            </Link>
          </li>
          <li class="navbar-link-to-signin-account">
            {user?.displayName ? (
              <Link class="navbar-link-to-account" to="/Account">
                Account
              </Link>
            ) : (
              <Link class="navbar-link-to-signin" to="SignIn">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
