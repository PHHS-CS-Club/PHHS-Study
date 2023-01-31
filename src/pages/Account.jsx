import React, { useEffect } from "react";
import { set, ref, onValue } from "firebase/database";
import { database } from "../firebase-config";
import { UserAuth } from "../context/AuthContext";
import "./Account.css";

export default function Signin() {
  const { user, logOut } = UserAuth();
  useEffect(() => {
    //Updates user's data when opening account page
    if (user.uid !== undefined) {
      const dbRef = ref(database, "users/" + user.uid);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          set(dbRef, {
            username: user.displayName,
            email: user.email,
            role: "student",
          });
        }
      });
    }
  }, [user]);

  return (
    //display any user information from signed in user here
    //also add functionality to edit display name and such
    //any other features
    //current database structure has each account with a role, email, and display name
    //all of which are accessed through user/ with their user id
    <>
      <div class="account-starter">Account Page Dev Test Addition 2</div>
      <p>
        username:
      </p>
      <p>
        email:
      </p>
      <p>
        most popular decks:
      </p>
      <button class="account-logout" onClick={logOut}>
        Log Out
      </button>
    </>
  );
}
