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

	//Gets the flashcard sets that the user has made
	useEffect(() => {
		onValue(dbRef, (snapshot) => {
			if (madeSets !== snapshot.child("madeSets").val()) {
				setMadeSets(snapshot.child("madeSets").val());
			}
		});
		//eslint-disable-next-line
	}, []);

	//Changes usernameInput to the value of the text box that the user types their new username in
	const changeUsernameInput = (event) => {
		setUsernameInput(event.target.value);
	};

	//Changes the user's username to the text that is in the textbox if it is longer than 0 characters and less than 18 characters
	//Also changes the author name in each of the user's made sets to the new username
	//Otherwise alerts
	const changeUsername = () => {
		if (usernameInput.length > 0 && usernameInput.length <= 18) {
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

	//Text input element
	//Button that changes the user's username if the text box isn't empty
	return (
		<div className="field-container">
			<label
				htmlFor="change-username"
				className="user-field-change-label"
			>
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
