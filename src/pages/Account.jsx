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

  const [input, setInput] = useState("");

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

  const changeInput = (event) => {
    setInput(event.target.value);
  }

  const changeUsername = () => {
    if (input.length > 0 && input.length <= 18 && input !== username) {
      let newName = input;
      update(ref(database, "users/" + id), {
        username: newName,
      });
    } else {
      alert("Please enter a valid username");
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
            <div className="change-username-wrap">
              <input onChange={changeInput} value={input} placeholder="New username" type="text" className="change-name"></input>
              <button className="change-field" onClick={changeUsername}>
                Change username
              </button>
            </div>
          </div>
          <div className="user-field">
            <div className="field-text">
              Role: {role}
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