import React from "react";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import SetBoxView from "../components/SetBoxView";
import "./SearchPage.css";
import ClassesMenu from "../components/ClassesMenu";
import TeachersMenu from "../components/TeachersMenu";

export default function SearchPage() {
  const [flashcardMeta, setFlashcardMeta] = useState({});

  // eslint-disable-next-line
  const [classes, setClasses] = useState({});
  // eslint-disable-next-line
  const [teachers, setTeachers] = useState({});
  const [searchRecentInput, setSearchRecentInput] = useState("");

  //useState to store search information
  //useState object to store picked classes/teachers
  useEffect(() => {
    onValue(ref(database, "flashcard-sets/"), (snapshot) => {
      const data = snapshot.val();
      setFlashcardMeta(data);
    });
    // eslint-disable-next-line
  }, []);

  function searchBar() {
    return (
      <div className="search-bar-container">
        <input
          key="search"
          type="text"
          placeholder="Search flashcards by title"
          className="search-bar"
          onChange={(e) => setSearchRecentInput(e.target.value.toLowerCase())}
        />
      </div>
    );
  }

  function teacherFilter(item) {
    if (!Object.values(teachers).includes(true)) {
      return true;
    }
    let temp = structuredClone(teachers);
    Object.keys(temp).forEach((key) => {
      if (!temp[key]) delete temp[key];
    });
    let test = false;
    item?.Teachers?.forEach((x, i) => {
      console.table(Object.keys(temp).includes(x));
      if (Object.keys(temp).includes(x)) {
        test = true;
      }
    });
    return test;
  }

  function classFilter(item) {
    if (!Object.values(classes).includes(true)) {
      return true;
    }
    let temp = structuredClone(classes);
    Object.keys(temp).forEach((key) => {
      if (!temp[key]) delete temp[key];
    });
    let test = false;
    item?.Classes?.forEach((x, i) => {
      console.table(Object.keys(temp).includes(x));
      if (Object.keys(temp).includes(x)) {
        test = true;
      }
    });
    return test;
  }

  if (flashcardMeta !== undefined && flashcardMeta !== null) {
    return (
      <div className="search-page">

        {searchBar()}
        <div className="create-set-extras">
          <ClassesMenu classSelect={(classes) => setClasses(classes)} />
          <TeachersMenu teacherSelect={(teachers) => setTeachers(teachers)} />
        </div>
        {/**Input object onChange updates the search information in the useState */}
        {/**Input object onChange updates the search information in the useState */}
        {/**Before map filter the array using .filter().map where in the filter put some booleans to check if it matches*/}
        {Object.keys(flashcardMeta)
          .filter((item) => {
            return (
              flashcardMeta[item].Name.toLowerCase().includes(
                searchRecentInput
              ) &&
              teacherFilter(flashcardMeta[item]) &&
              classFilter(flashcardMeta[item])
            );
          })
          .map((key, index) => (
            <div key={key} className="search-cnpontainer">
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
