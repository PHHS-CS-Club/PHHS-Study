import React, { useEffect, useState } from "react";
import { set, ref, onValue, get } from "firebase/database";
import { database } from "../firebase-config";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import "./Account.css";

export default function Signin() {
  let { id } = useParams();
  const { user, logOut } = UserAuth();
  useEffect(() => {
    //Updates user's data when opening account page
    if (id !== undefined) {
      const dbRef = ref(database, "users/" + id);
      get(dbRef, (snapshot) => {
        if (id === user.uid) {
          if (snapshot.child("username").val() === null) {
            set(dbRef, {
              username: user.displayName,
            });
          }
          if (snapshot.child("role").val() === null) {
            set(dbRef, {
              role: "student",
            });
          }
          if (snapshot.child("email").val() === null) {
            set(dbRef, {
              email: user.email,
            });
          }
        }
      });
    }
  }, [id, user]);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("")

  const [input, setInput] = useState("");

  const changeUsername = () => {
    if (input.length > 0) {
      let newName = input;
      set(ref(database, "users/" + id), {
        username: newName,
        email: email,
        role: role,
      });
    } else {
      alert("Please enter a valid username");
    }
  }

  const changeInput = (event) => {
    setInput(event.target.value);
  }

  useEffect(() => {
    const userRef = ref(database, "users/" + id);
    onValue(userRef, (snapshot) => {
      setUsername(snapshot.child("username").val());
      setRole(snapshot.child("role").val());
      setEmail(snapshot.child("email").val());
    })
  });

  return (
    //display any user information from signed in user here
    //also add functionality to edit display name and such
    //any other features
    //current database structure has each account with a role, email, and display name
    //all of which are accessed through user/ with their user id
    <>
      <div className="outer-border">
        <div>My Account</div>
        <div className="account-info">
          <div className="user-field">
            <p className="field-text">
              Username: {username}
            </p>
            <div className="change-username-wrap">
              <input onChange={changeInput} value={input} placeholder="New username" type="text" className="change-name"></input>
              <button className="change-field" onClick={changeUsername}>
                Change username
              </button>
            </div>
          </div>
          <div className="user-field">
            <p className="field-text">
              Role: {role}
            </p>
          </div>
          <div className="user-field">
            <p className="field-text">
              Email: {email}
            </p>
          </div>
        </div>
        <button className="account-logout" onClick={logOut}>
          Log Out
        </button>
      </div>
    </>

  );
}