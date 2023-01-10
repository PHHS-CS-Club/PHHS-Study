import React from "react";
import { Outlet, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function Navbar() {
	//Always loaded, used to link back to account and home page etc
	const { user } = UserAuth();
	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to="/Home">Home</Link>
					</li>
					<li>
						{user?.displayName ? (
							<Link to="/CreateSet">Create Set</Link>
						) : (
							<></>
						)}
					</li>
					<li>
						{user?.displayName ? (
							<Link to="/Account">Account</Link>
						) : (
							<Link to="SignIn">Sign In</Link>
						)}
					</li>
				</ul>
			</nav>

			<Outlet />
		</>
	);
}
