import React, { useEffect } from "react";
import { set, ref } from "firebase/database";
import { database } from "../firebase-config";
import { UserAuth } from "../context/AuthContext";

export default function Signin() {
	const { user, logOut } = UserAuth();
	useEffect(() => {
		if (user.uid !== undefined) {
			set(ref(database, "users/" + user.uid), {
				username: user.displayName,
				email: user.email,
				role: "student",
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
			<div>Account Page</div>
			<button onClick={logOut}>Log Out</button>
		</>
	);
}
