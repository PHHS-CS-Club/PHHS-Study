import React from "react";
import * as Teachers from "../constants/teachers";
import { useState, useEffect } from "react";
import "./TeachersMenu.css";

//Teacher select menu
//Props: teacherSelect - function that updates teacher data in parent
//teachers - default teacher information passed in as an object
export default function TeachersMenu(props) {
  const [teachers, setTeachers] = useState({});
  const [searchLastInput, setSearchLastInput] = useState("");

  //Sets the teachers object
  useEffect(() => {
    if (props.teachers) {
      setTeachers(props.teachers);
    }
  }, [props.teachers]);

  //Function ran when a checkbox value is changed, updates the teachers object with the new data
  //Also runs the teacherSelect function passed in through props that updates the teachers in the parent
  const handleTeacherChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    if (value !== undefined) {
      setTeachers({ ...teachers, [name]: value });
      props.teacherSelect({ ...teachers, [name]: value });
    }
  };

  //Given the teacher's name, returns a checkbox <div> which contains the checkbox input and label
  function checkbox(x) {
    return (
      <div className="teacher-checkbox" style={{ display: "inline" }}>
        {/**Checkbox */}
        <input
          className="teacher-check"
          style={{ display: "inline" }}
          type="checkbox"
          name={x}
          id={x + "-box"}
          key={x}
          onChange={handleTeacherChange}
          checked={teachers[x] !== undefined && teachers[x] === true}
        ></input>{" "}
        {/**Label */}
        <label
          className="teacher-label"
          style={{ display: "inline", userSelect: "none" }}
          htmlFor={x}
        >
          {x.split(", ")[1].substring(0, 1) + ". " + x.split(", ")[0]}
        </label>
        <br />
      </div>
    );
  }

  //Returns the teacher search bar which stores the search in searchLastInput on change
  function searchBar() {
    return (
      <div className="teacher-search-bar-container">
        <input
          key="search"
          type="text"
          placeholder="Search teachers by last name"
          className="teacher-search-bar"
          onChange={(e) => setSearchLastInput(e.target.value)}
        />
      </div>
    );
  }

  //Returns all teachers that match the search condition or are selected
  function showBoxes() {
    return (
      <div className="teachers-cs" id="teachers">
        {/**Maps through teachers*/}
        {Teachers.TEACHERS.map((x) => {
          /**Gets last name*/
          let last = x.split(", ")[0];
          
            /**Checks if last name includes search, if yes returns checkbox*/
          
          if (
            last.toLowerCase().includes(searchLastInput.toLowerCase()) &&
            searchLastInput !== ""
          ) {
            return checkbox(x);
          } else {
            
              /**Checks if teacher is selected if search doesn't match, if yes returns*/
            
            if (Object.values(teachers).includes(true)) {
              if (teachers[x]) return checkbox(x);
            }
            
              /**Returns empty fragment if nothing*/
            
            return <React.Fragment key={x}></React.Fragment>;
          }
        })}
      </div>
    );
  }

  //returns the search bar and boxes all in a <div>
  return (
    <div className="teacher-container">
      {searchBar()}
      <div className="teacher-box-container">{showBoxes()}</div>
    </div>
  );
}
