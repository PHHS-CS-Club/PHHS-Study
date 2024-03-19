import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase-config";
import { useEffect } from "react";

//Wrap this component around something to disallow nonadmin users from accessing the content
//Must wrap a <Protected> component around this as well
export const AdminLevelProtected = ({ children }) => {
	const { user } = UserAuth();
	const navigate = useNavigate();

	useEffect(() => {
		onValue(
			ref(database, "users/" + user.uid + "/role"),
			(snapshot) => {
				if (snapshot.val() !== "Admin" && snapshot.val() != null) {
					navigate("/Home");
				}
			},
			{
				onlyOnce: true,
			}
		);
	}, [children, navigate, user.uid]);
	if (user?.uid !== null && user?.uid !== undefined) {
		return children;
	}
};

//Wrap this component around something to disallow nonsigned in users from accessing the content
const Protected = ({ children }) => {
	const { user } = UserAuth();
	if (!user) {
		return <Navigate to="/Home" />;
	}

	return children;
};

export default Protected;
