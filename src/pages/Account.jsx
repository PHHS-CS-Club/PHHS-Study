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
import XButton from "../icons/x-symbol.svg";

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
          setUsername(snapshot.child("username").val());
          setRole(snapshot.child("role").val());
          setEmail(snapshot.child("email").val());
          setMadeSets(snapshot.child("madeSets").val());
          if (snapshot.child("username").val() === null && 
          snapshot.child("role").val() === null &&
          snapshot.child("email").val() === null &&
          snapshot.child("madeSets").val() === null) {
            set(dbRef, {
              username: user.displayName,
              email: user.email,
              role: "Student",
              madeSets: [],
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

  const changeFieldDisplayIcon = (changingField, changeField) => {
    if (!changingField) {
      return (<img src={EditButton} className="edit-pencil" alt={changeField} width="12" height="12"/>)
    }
    return (<img src={XButton} className="x-button" alt="Close" width="12" height="12"/>)
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
              {changeFieldDisplayIcon(changingUsername, "Change username")}
            </button>
            {changeUsernameDisplay()}
          </div>
          <div className="user-field">
            <div className="field-text">Role: {role}</div>
            <button onClick={changeRoleSwitch} className="change-field-button">
              {changeFieldDisplayIcon(changingRole, "Change role")}
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