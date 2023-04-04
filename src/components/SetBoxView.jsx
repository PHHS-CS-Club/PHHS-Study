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

const SetBoxView = (id) => {
  const [flashcardMeta, setFlashcardMeta] = useState({});
  const { user } = UserAuth();
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
    if (flashcardMeta.Classes !== undefined) {
      return flashcardMeta?.Classes.map((x) => {
        return " " + x;
      });
    }
  }

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
        {console.log(user.uid + flashcardMeta.AuthorID)}
        {flashcardMeta.AuthorID === user.uid ? (
          <Link to={"/Edit/" + id.id} className="edit-icon-setbox">
            <BsPencilSquare />
          </Link>
        ) : (
          <></>
        )}
        <div className="search-set-name">{flashcardMeta.Name}</div>
        <div className="search-set-author">{"By: " + flashcardMeta.Author}</div>
        <div className="search-set-classes" id="classes-view">
          {flashcardMeta.Classes !== undefined ? flashcardMeta.Classes[0] : ""}
          <div
            data-tooltip-id="class-tooltip"
            data-tooltip-content={classesList() ? classesList() : ""}
            className="tooltip-container"
          >
            <AiOutlineQuestionCircle className="tooltip-icon" />
          </div>
        </div>

        <div className="search-set-teachers" id="teacher-view">
          {flashcardMeta.Teachers !== undefined
            ? flashcardMeta.Teachers[0]
            : ""}
          <div
            data-tooltip-id="teacher-tooltip"
            data-tooltip-content={teachersList() ? teachersList() : ""}
            className="tooltip-container"
          >
            <AiOutlineQuestionCircle className="tooltip-icon" />
          </div>
        </div>

        <Tooltip id="teacher-tooltip" />
        <Tooltip id="class-tooltip" />
      </div>
    </>
  );
};

export default SetBoxView;
