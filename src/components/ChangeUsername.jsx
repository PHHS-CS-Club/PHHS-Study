import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import { ref, update, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import "./ChangeUserField.css";

export default function ChangeUsername() {
  let { id } = useParams();

    const dbRef = ref(database, "users/" + id);

    const [usernameInput, setUsernameInput] = useState("");
    const [madeSets, setMadeSets] = useState([]);

    useEffect(() => {
      onValue(
        dbRef,
        (snapshot) => {
          if (madeSets !== snapshot.child("madeSets").val()) {
            setMadeSets(snapshot.child("madeSets").val());
          }
        }
      );
      //eslint-disable-next-line
    }, []);

    const changeUsernameInput = (event) => {
        setUsernameInput(event.target.value);
    };

    const changeUsername = () => {
        if (
          usernameInput.length > 0 &&
          usernameInput.length <= 18
        ) {
          update(dbRef, {
            username: usernameInput,
          });
          for (let i = 0; i < madeSets.length; i++) {
            update(ref(database, "flashcard-sets/" + madeSets[i]), {
              Author: usernameInput,
            });
          }
        } else {
          alert("Please enter a valid username");
        }
    };

    return (
      <div>
        <label htmlFor="change-username" className="user-field-change-label">
          Enter new username (max 18 characters):
        </label>
        <div className="change-field-wrap">
            <input
                id="change-username"
                onChange={changeUsernameInput}
                value={usernameInput}
                placeholder="New username"
                type="text"
                className="change-username-input"
            ></input>
            <button className="change-field" onClick={changeUsername}>
                Change username
            </button>
        </div>
      </div>
    );
}