import { useState } from "react";
import { database } from "../firebase-config";
import { ref, update } from "firebase/database";
import { useParams } from "react-router-dom";
import "./ChangeUserField.css";

export default function ChangeRole() {
  let { id } = useParams();
  const dbRef = ref(database, "users/" + id);
  const [roleInput, setRoleInput] = useState("");

  const changeRoleInput = (event) => {
    setRoleInput(event.target.value);
  };

  const changeRole = () => {
    if (roleInput !== "") {
      update(dbRef, {
        role: roleInput,
      });
    } else {
      alert("Please select a different role");
    }
  };

  return (
    <div>
    	<label htmlFor="role-select">
				Select new role:
			</label>
      <div className="change-field-wrap">
        <select id="role-select" className="change-role-select" onChange={changeRoleInput}>
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