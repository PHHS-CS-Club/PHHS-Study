import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Navbar from "./pages/Navbar";
import Signin from "./pages/Signin";
import Protected, { AdminLevelProtected } from "./components/Protected";
import CreateSet from "./pages/CreateSet";
import EditSet from "./pages/EditSet";
import { useRef } from "react";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";
import SearchPage from "./pages/SearchPage";
import ViewSet from "./pages/ViewSet";
import CheckSignedIn from "./components/CheckSignedIn";
import Admin from "./pages/Admin";

function App() {
  const ref = useRef();

  return (
    <div className="App" ref={ref}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="Home" element={<Home />} />
              <Route
                path="Account/:id"
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
              <Route
                path="Search"
                element={
                  <div
                    style={{
                      position: "relative",
                      width:
                        ref.current !== undefined && ref.current !== null
                          ? ref.current.offsetWidth
                          : "100%",
                    }}
                  >
                    <SearchPage />
                  </div>
                }
              />
              <Route
                path="SignIn"
                element={
                  <CheckSignedIn>
                    <Signin />
                  </CheckSignedIn>
                }
              />
              <Route path="Set/:id" element={<ViewSet />}></Route>
              <Route path="Edit/:id" element={<EditSet />} />
              <Route
                path="Admin"
                element={
                  <Protected>
                    <AdminLevelProtected>
                      <Admin />
                    </AdminLevelProtected>
                  </Protected>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
