import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase-config";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SetBoxView from "../components/SetBoxView";
import ChangeUsername from "../components/ChangeUsername";
import ChangeRole from "../components/ChangeRole";
import "./Account.css";
import EditButton from "../icons/pencil-edit-button.svg";

export default function Signin() {
  let { id } = useParams();
  const { user, logOut } = UserAuth();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [madeSets, setMadeSets] = useState([]);
  
  const [changingUsername, setChangingUsername] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  const dbRef = ref(database, "users/" + id);

  useEffect(() => {
    //Updates user's data when opening account page
    if (id !== undefined && id === user.uid) {
      onValue(
        dbRef,
        (snapshot) => {
          if (
            username !== snapshot.child("username").val() ||
            role !== snapshot.child("role").val() ||
            email !== snapshot.child("email").val() ||
            madeSets !== snapshot.child("madeSets").val()
          ) {
            setUsername(snapshot.child("username").val());
            setRole(snapshot.child("role").val());
            setEmail(snapshot.child("email").val());
            setMadeSets(snapshot.child("madeSets").val());
          }
          if (email === null || username === null || role === null) {
            set(dbRef, {
              username: user.displayName,
              role: "Student",
              email: user.email,
              madeSets: madeSets,
            });
          }
        }
      );
    }
    //eslint-disable-next-line
  }, []);

  function madeSetsDisplay() {
    if (madeSets !== null && madeSets !== undefined) {
      return (
        <div className="owned-sets">
          <div className="owned-sets-header">My Sets</div>
          <div className="owned-sets-boxes">
            {madeSets.map((key, index) => (
              <div key={key} className="search-container">
                {madeSets[index].length !== 0 ? (
                  <Link to={"/Set/" + key}>
                    <SetBoxView id={key} key={key} />
                  </Link>
                ) : (
                  <Link to={"/Set/" + key}>{"No Title"}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="owned-sets">
          <div className="owned-sets-header">
            Create a set and it will show up here!
          </div>
        </div>
      );
    }
  }

  const changeUsernameSwitch = () => {
    setChangingUsername(!changingUsername);
  }

  const changeUsernameDisplay = () =>  {
    if (changingUsername) {
      return (
        <ChangeUsername></ChangeUsername>
      );
    }
    return (
      <></>
    );
  }

  const changeRoleSwitch = () => {
    setChangingRole(!changingRole);
  }

  const changeRoleDisplay = () =>  {
    if (changingRole) {
      return (
        <ChangeRole></ChangeRole>
      );
    }
    return (
      <></>
    );
  }

  return (
    //display any user information from signed in user here
    //also add functionality to edit display name and such
    //any other features
    //current database structure has each account with a role, email, and display name
    //all of which are accessed through user/ with their user id
    <div className="account-page">
      <div className="outer-border">
        <div className="title">My Account</div>
        <div className="account-info">
          <div className="user-field">
            <div className="field-text">Username: {username}</div>
            <button onClick={changeUsernameSwitch} className="change-field-button">
              <img src={EditButton} className="edit-pencil" alt="Change username" width="15" height="15"/>
            </button>
            {changeUsernameDisplay()}
          </div>
          <div className="user-field">
            <div className="field-text">Role: {role}</div>
            <button onClick={changeRoleSwitch} className="change-field-button">
              <img src={EditButton} className="edit-pencil" alt="Change role" width="15" height="15"/>
            </button>
            {changeRoleDisplay()}
          </div>
          <div className="user-field">
            <div className="field-text">Email: {email}</div>
          </div>
        </div>
        <button className="account-logout" onClick={logOut}>
          Log Out
        </button>
      </div>
      {madeSetsDisplay()}
    </div>
  );
}