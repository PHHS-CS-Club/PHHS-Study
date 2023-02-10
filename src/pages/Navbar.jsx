import React, {useEffect, useState} from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  //Always loaded, used to link back to account and home page etc
  const { user } = UserAuth();
  const [accpath, setAccpath] = useState("");
  useEffect(() => {
    if(user?.displayName) {
      setAccpath("/Account/" + user.uid);
    }
  }, [user]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/Home">Home</Link>
          </li>
          <li>
            {user?.displayName ? (
              <Link to="/CreateSet">Create Set</Link>
            ) : (
              <></>
            )}
          </li>
          <li>
            {user?.displayName ? (
              <Link to={accpath}>Account</Link>
            ) : (
              <Link to="SignIn">Sign In</Link>
            )}
          </li>
          <li>
            <Link to="/Search">Search</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
