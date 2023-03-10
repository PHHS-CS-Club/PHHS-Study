import React from "react";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import "./SetBoxView.css";

const SetBoxView = (id) => {
  const [flashcardMeta, setFlashcardMeta] = useState({});
  const [hoveringClasses, setHoveringClasses] = useState(false);

  const dbRef = ref(database, "/flashcard-sets/" + id.id);

  useEffect(() => {
    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setFlashcardMeta(data);
      },
      {
        onlyOnce: true,
      }
    );
    //eslint-disable-next-line
  }, []);


  function classesList() {
    if(flashcardMeta.Classes !== undefined) {
      return (
        <div className="classes-tooltip-item">
          {flashcardMeta?.Classes.map((x) => {
            return (x + ", ");
          })}
        </div>
      )
    } 
    
  }
  

  return (
    <div className="search-set-container">
      <div className="search-set-name">{flashcardMeta.Name}</div>
      <div className="search-set-author">{"By: " + flashcardMeta.Author}</div>
      <div
        className="search-set-classes"
        id="classes-view"
      >
        {flashcardMeta.Classes !== undefined ? (flashcardMeta.Classes[0]) : ""}
        <div className="tooltip-container">
          <AiOutlineQuestionCircle className="tooltip-icon"onMouseEnter={() => setHoveringClasses(true)}
          onMouseLeave={() => setHoveringClasses(false)}/> 
          <div className={"classes-info" + (hoveringClasses ? " classes-hover" : "")}>
            {classesList()}
          </div>
        </div>
        
      </div>
     
      <div className="search-set-teachers" id="classes-view">
        Teachers
      </div>

    </div>
  );
};

export default SetBoxView;
