import * as Teachers from "../constants/teachers";
import { useState } from "react";
import "./TeachersMenu.css";

export default function TeachersMenu(props) {
  const [teachers, setTeachers] = useState([]);
  const [searchLastInput, setSearchLastInput] = useState("");

  const handleTeacherChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const boxss = target.name;
    if (value !== undefined) {
      setTeachers({ ...teachers, [boxss]: value });
      props.teacherSelect({ ...teachers, [boxss]: value });
    }
    console.log(boxss);
  };

  function checkbox(x) {
    return (
      <div className="teacher-checkbox" style={{ display: "inline" }}>
        {" "}
        <input
          className="teacher-check"
          style={{ display: "inline" }}
          type="checkbox"
          name={x}
          id={x + "-box"}
          onChange={handleTeacherChange}
          checked={teachers[x] !== undefined && teachers[x] === true}
        ></input>{" "}
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

  function searchBar() {
    return (
      <div className="teacher-search-bar-container">
        <input
          type="text"
          placeHolder="Search teachers by last name"
          className="teacher-search-bar"
          onChange={(e) => setSearchLastInput(e.target.value)}
        />
      </div>
    );
  }

  function showBoxes() {
    return (
      <div className="teachers-cs" id="teachers">
        {Teachers.TEACHERS.map((x) => {
          let last = x.split(", ")[0];
          if (
            last.toLowerCase().includes(searchLastInput.toLowerCase()) &&
            searchLastInput !== ""
          ) {
            return checkbox(x);
          } else {
            return <></>;
          }
        })}
      </div>
    );
  }

  return (
    <div className="teacher-container">
      {searchBar()}
      <div className="teacher-box-container">{showBoxes()}</div>
    </div>
  );
}
