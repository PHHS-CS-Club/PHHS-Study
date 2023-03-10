import React from "react";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import { Tooltip } from "react-tooltip";
import "./SetBoxView.css";

const SetBoxView = (id) => {
  const [flashcardMeta, setFlashcardMeta] = useState({});

  const dbRef = ref(database, "/flashcard-sets/" + id.id);

  useEffect(() => {
    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setFlashcardMeta(data);
        console.log(data);
      },
      {
        onlyOnce: true,
      }
    );
    //eslint-disable-next-line
  }, []);

  return (
    <div className="search-set-container">
      <div className="search-set-name">{flashcardMeta.Name}</div>
      <div className="search-set-author">{"By: " + flashcardMeta.Author}</div>
      <div
        className="search-set-classes"
        data-tooltip-content={flashcardMeta.classes}
        id="classes-view"
      >
        Classes
      </div>
      <div className="search-set-teachers" id="classes-view">
        Teachers
      </div>
      <Tooltip anchorSelect=".search-set-classes" id="classes-view">
        {flashcardMeta.classes}
      </Tooltip>
    </div>
  );
};

export default SetBoxView;
