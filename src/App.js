import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Navbar from "./pages/Navbar";
import Signin from "./pages/Signin";
import Protected from "./components/Protected";
import CreateSet from "./pages/CreateSet";

import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
	return (
		<div className="App">
			<AuthContextProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Navbar />}>
							<Route path="Home" element={<Home />} />
							<Route
								path="Account"
								element={
									<Protected>
										<Account />
									</Protected>
								}
							/>
							<Route
								path="CreateSet"
								element={
									<Protected>
										<CreateSet />
									</Protected>
								}
							/>
							<Route path="SignIn" element={<Signin />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthContextProvider>
		</div>
	);
}

export default App;
