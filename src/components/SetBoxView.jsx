import React from "react";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import "./SetBoxView.css";
import "react-tooltip/dist/react-tooltip.css";
import { UserAuth } from "../context/AuthContext";

//Creates a box for each flashcard set containing the metaData relevant to the users.
//Props: id - id of the set as a string
//Displayed in search page and account page
const SetBoxView = (id) => {
  const [flashcardMeta, setFlashcardMeta] = useState({});
  const { user } = UserAuth();
  const dbRef = ref(database, "/flashcard-sets/" + id.id);

  //Gets the metadata and sets it into a flashcardMeta object
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

  //Parses the classes into a string
  function classesList() {
    if (flashcardMeta.Classes !== undefined) {
      return flashcardMeta?.Classes.map((x) => {
        return " " + x;
      });
    }
  }

  //Parses the teachers into a string
  function teachersList() {
    if (flashcardMeta.Teachers !== undefined) {
      return flashcardMeta?.Teachers.map((x) => {
        return " " + x;
      });
    }
  }

  return (
    <>
      <div className="search-set-container">
        {/*Box in corner which links to edit set, only shows up when user is the author of the set*/}
        {flashcardMeta?.AuthorID === user?.uid ? (
          <Link to={"/Edit/" + id.id} className="edit-icon-setbox">
            <BsPencilSquare />
          </Link>
        ) : (
          <></>
        )}
        {/*Displays the info from the flashcardMeta*/}
        <div className="search-set-name">{flashcardMeta.Name}</div>
        <div className="search-set-author">{"By: " + flashcardMeta.Author}</div>
        {/*Displays the first item for classes/teachers, and then displays the rest in a tooltip that the user can hover over*/}
        <div className="search-set-classes" id="classes-view">
          {/*First item here*/}
          {flashcardMeta.Classes !== undefined ? flashcardMeta.Classes[0] : ""}
          {/*Tooltip data here*/}
          <div
            data-tooltip-id="class-tooltip"
            data-tooltip-content={classesList() ? classesList() : ""}
            className="tooltip-container"
          >
            <AiOutlineQuestionCircle className="tooltip-icon" />
          </div>
        </div>
        <div className="search-set-teachers" id="teacher-view">
          {/*First item here*/}
          {flashcardMeta.Teachers !== undefined
            ? flashcardMeta.Teachers[0]
            : ""}
          {/*Tooltip data here*/}
          <div
            data-tooltip-id="teacher-tooltip"
            data-tooltip-content={teachersList() ? teachersList() : ""}
            className="tooltip-container"
          >
            <AiOutlineQuestionCircle className="tooltip-icon" />
          </div>
        </div>
        {/**If you want to find out how to use the tooltip, here is the npm package: https://www.npmjs.com/package/react-tooltip */}
        <Tooltip id="teacher-tooltip" />
        <Tooltip id="class-tooltip" />
      </div>
    </>
  );
};

export default SetBoxView;
