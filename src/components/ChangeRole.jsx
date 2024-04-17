import { useState } from "react";
import { database } from "../firebase-config";
import { ref, update } from "firebase/database";
import { useParams } from "react-router-dom";
import "./ChangeUserField.css";

export default function ChangeRole() {
	let { id } = useParams();

	const dbRef = ref(database, "users/" + id);

	const [roleInput, setRoleInput] = useState("");

	//Sets roleInput to the current value of the select element
	//Called when value of select element changes
	const changeRoleInput = (event) => {
		setRoleInput(event.target.value);
	};

	//Changes the role of the user to roleInput if the user has selected a role in the select element
	//Otherwise alerts
	//Called when user presses 'Change role' button
	const changeRole = () => {
		if (roleInput !== "") {
			update(dbRef, {
				role: roleInput,
			});
		} else {
			alert("Please select a different role");
		}
	};

	//Select element with possible roles
	//Button that changes the user's role to the selected role if there is one selected
	return (
		<div className="field-container">
			<label htmlFor="role-select" className="user-field-change-label">
				Select new role:
			</label>
			<div className="change-field-wrap">
				<select
					id="role-select"
					className="change-role-select"
					onChange={changeRoleInput}
				>
					<option value="Student">Student</option>
					<option value="Teacher">Teacher</option>
				</select>
				<button className="change-field" onClick={changeRole}>
					Change role
				</button>
			</div>
		</div>
	);
}
