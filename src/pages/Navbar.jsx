import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  //Always loaded, used to link back to account and home page etc
  const { user } = UserAuth();
  const [accpath, setAccpath] = useState("");
  useEffect(() => {
    if (user?.displayName) {
      setAccpath("/Account/" + user.uid);
    }
  }, [user]);

  return (
    <>
      <nav className="navbar-container">
        <ul className="navbar-bar">
          <li className="navbar-link">
            <Link className="navbar-link-real" to="/Home">
              Home
            </Link>
          </li>
          <li className="navbar-link">
            {user?.displayName ? (
              <Link className="navbar-link-real" to="/CreateSet">
                Create Set
              </Link>
            ) : (
              <></>
            )}
          </li>
          <li className="navbar-link">
            {user?.displayName ? (
              <Link className="navbar-link-real" to={accpath}>
                Account
              </Link>
            ) : (
              <Link className="navbar-link-real" to="SignIn">
                Sign In
              </Link>
            )}
          </li>
          <li className="navbar-link">
            <Link className="navbar-link-real" to="/Search">
              Search
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
