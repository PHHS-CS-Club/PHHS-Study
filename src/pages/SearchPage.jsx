import React from "react";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

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
  }, []);

  return (
    <>
      {Object.keys(flashcardMeta).map((key, index) => (
        <div>
          {flashcardMeta[key].Name.length !== 0 ? (
            <Link to={"/Set/" + key}>{flashcardMeta[key].Name}</Link>
          ) : (
            <Link to={"/Set/" + key}>{"No Title"}</Link>
          )}
        </div>
      ))}
    </>
  );
}
