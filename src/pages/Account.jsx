import React, { useEffect, useState } from "react";
import { set, ref, onValue } from "firebase/database";
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
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (!data && id === user.uid && id === user.uid) {
          set(dbRef, {
            username: user.displayName,
            email: user.email,
            role: "student",
          });
        }
      });
    }
  }, [id, user]);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const userRef = ref(database, "users/" + id + "/username");
    onValue(userRef, (snapshot) => {
      setUsername(snapshot.val());
    })
  });

  return (
    //display any user information from signed in user here
    //also add functionality to edit display name and such
    //any other features
    //current database structure has each account with a role, email, and display name
    //all of which are accessed through user/ with their user id
    <>
      <div className="account-starter">Account Page Dev Test Addition 2</div>
      <div className="account-info">
        <div className="user-field">
          <p className="field-text">
            Username: {username}
          </p>
          <button className="change-field" onClick={() => changeUsername(id, "huh")}>
            Change username
          </button>
        </div>
        <div className="user-field">
          <p className="field-text">
            Email: {user.email}
          </p>
        </div>
      </div>
      <button className="account-logout" onClick={logOut}>
        Log Out
      </button>
    </>
  );
}

const changeUsername = (userId, newName) => {
  console.log(userId);
  set(ref(database, "users/" + userId), {
    username: newName,
  });
}