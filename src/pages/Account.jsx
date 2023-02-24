import React, { useEffect } from "react";
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
            Username: {getUsername(id)}
          </p>
          <button className="change-field" onClick={() => changeUsername(id, "yah yah")}>
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
  set(ref(database, "users/" + userId), {
    username: newName,
  });
}

const getUsername = (userId) => {
  console.log("getting username...")
  let name; 
  const userRef = ref(database, "users/" + userId + "/username");
  onValue(userRef, (snapshot) => {
    name = snapshot.val();
  });

  return name;
}