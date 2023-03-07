import React from "react";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import SetBoxView from "../components/SetBoxView";
import "./SearchPage.css";

export default function SearchPage() {
  const [flashcardMeta, setFlashcardMeta] = useState({});
  useEffect(() => {
    onValue(ref(database, "flashcard-sets/"), (snapshot) => {
      console.log("test");
      const data = snapshot.val();
      setFlashcardMeta(data);
      console.log(data);
    });
    console.log(flashcardMeta);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {Object.keys(flashcardMeta).map((key, index) => (
        <div key={key} className="search-container">
          {flashcardMeta[key].Name.length !== 0 ? (
            <Link to={"/Set/" + key}>
              <SetBoxView id={key} />
            </Link>
          ) : (
            <Link to={"/Set/" + key}>{"No Title"}</Link>
          )}
        </div>
      ))}
    </>
  );
}
