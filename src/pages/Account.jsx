import React, { useEffect, useState } from "react";
import { ref, onValue, update, set } from "firebase/database";
import { database } from "../firebase-config";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import "./Account.css";

export default function Signin() {
  let { id } = useParams();
  const { user, logOut } = UserAuth();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const [usernameInput, setUsernameInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  useEffect(() => {
    //Updates user's data when opening account page
    if (id !== undefined && id === user.uid) {
      const dbRef = ref(database, "users/" + id);
      onValue(dbRef, (snapshot) => {
        setUsername(snapshot.child("username").val());
        setRole(snapshot.child("role").val());
        setEmail(snapshot.child("email").val());
        if (email === null || username === null || role === null) {
          set(dbRef, {
            username: user.displayName,
            role: "Student",
            email: user.email,
          })
        }
      });
    }
  }, [id, user, email, role, username]);

  const changeUsernameInput = (event) => {
    setUsernameInput(event.target.value);
  }

  const changeRoleInput = (event) => {
    setRoleInput(event.target.value);
  }

  const changeUsername = () => {
    if (usernameInput.length > 0 && usernameInput.length <= 18 && usernameInput !== username) {
      update(ref(database, "users/" + id), {
        username: usernameInput,
      });
    } else {
      alert("Please enter a valid username");
    }
  }

  const changeRole = () => {
    if (roleInput !== role && roleInput !== "") { 
      update(ref(database, "users/" + id), {
        role: roleInput,
      });
    } else {
      alert("Please select a different role");
    }
  }

  return (
    //display any user information from signed in user here
    //also add functionality to edit display name and such
    //any other features
    //current database structure has each account with a role, email, and display name
    //all of which are accessed through user/ with their user id
    <>
      <div className="outer-border">
        <div className="title">
          My Account
        </div>
        <div className="account-info">
          <div className="user-field">
            <div className="field-text">
              Username: {username}
            </div>
            <label htmlFor="change-username">Enter new username (max 18 characters):</label>
            <div className="change-field-wrap">
              <input id="change-username" onChange={changeUsernameInput} value={usernameInput} placeholder="New username" type="text" className="change-username-input"></input>
              <button className="change-field" onClick={changeUsername}>
                Change username
              </button>
            </div>
          </div>
          <div className="user-field">
            <div className="field-text">
              Role: {role}
            </div>
            <label htmlFor="role-select">Select new role:</label>
            <div className="change-field-wrap">
              <select id="role-select" className="change-role-select" onChange={changeRoleInput}>
                <option value="" disabled selected>New role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              <button className="change-field" onClick={changeRole}>
                Change role
              </button>
            </div>
          </div>
          <div className="user-field">
            <div className="field-text">
              Email: {email}
            </div>
          </div>
        </div>
        <button className="account-logout" onClick={logOut}>
          Log Out
        </button>
      </div>
    </>
  );
}