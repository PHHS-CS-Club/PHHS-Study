import React from "react";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import SetBoxView from "../components/SetBoxView";
import "./SearchPage.css";

export default function SearchPage() {
  const [flashcardMeta, setFlashcardMeta] = useState({});
  //useState to store search information
  //useState object to store picked classes/teachers
  useEffect(() => {
    onValue(ref(database, "flashcard-sets/"), (snapshot) => {
      const data = snapshot.val();
      setFlashcardMeta(data);
    });
    // eslint-disable-next-line
  }, []);

  if (flashcardMeta !== undefined && flashcardMeta !== null) {
    return (
      <div className="search-page">
        {/**Input object onChange updates the search information in the useState */}
        {/**Before map filter the array using .filter().map where in the filter put some booleans to check if it matches*/}
        {Object.keys(flashcardMeta).map((key, index) => (
          <div key={key} className="search-container">
            {flashcardMeta[key].Name.length !== 0 ? (
              <Link to={"/Set/" + key}>
                <SetBoxView id={key} key={key} />
              </Link>
            ) : (
              <Link to={"/Set/" + key}>{"No Title"}</Link>
            )}
          </div>
        ))}
      </div>
    );
  }
}
