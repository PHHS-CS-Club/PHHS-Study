import { useState, useEffect } from "react";
import * as Classes from "../constants/classes";
import "./ClassesMenu.css";

export default function ClassesMenu(props) {
  const [classes, setClasses] = useState({});
  const [current, setCurrent] = useState("main");

  //Sets the classes object
  useEffect(() => {
    if (props.classes) {
      setClasses(props.classes);
    }
  }, [props.classes]);

  //Function ran when a checkbox value is changed, updates the teachers object with the new data
  //Also runs the classSelect function passed in through props that updates the class data in the parent
  const handleClassChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const boxss = target.name;
    if (value !== undefined) {
      setClasses({ ...classes, [boxss]: value });
      props.classSelect({ ...classes, [boxss]: value });
    }
  };

  //Given the classes' name, returns a checkbox <div> which contains the checkbox input and label
  function checkbox(x) {
    return (
      <div
        key={x}
        name={x}
        className="class-checkbox"
        style={{ display: "inline" }}
      >
        {/**Checkbox */}
        <input
          className="class-check"
          style={{ display: "inline" }}
          type="checkbox"
          name={x}
          id={x + "-box"}
          onChange={handleClassChange}
          checked={classes[x] !== undefined && classes[x] === true}
        ></input>{" "}
        {/**Label */}
        <label
          className="class-label"
          style={{ display: "inline", userSelect: "none" }}
          htmlFor={x + "-box"}
        >
          {x}
        </label>
        <br />
      </div>
    );
  }

  //Given a className, returns a button which changes the selected tab
  function classButton(className) {
    return (
      <button
        className="class-button"
        onClick={() => {
          if (current !== className) {
            setCurrent(className);
          } else {
            setCurrent("main");
          }
        }}
      >
        {className.charAt(0).toUpperCase() + className.slice(1)}
      </button>
    );
  }

  //Returns a classButton for each subject
  function classSelect() {
    return (
      <>
        <div className="class-select-title">Pick Classes</div>
        <div className="cs-class-buttons">
          {classButton("math")}
          {classButton("science")}
          {classButton("english")}
          {classButton("history")}
          {classButton("lang")}
          {classButton("njrotc")}
          {classButton("compsci")}
        </div>
      </>
    );
  }

  //For each class, generates the list of checkboxes if the subject is selected
  function showBoxes() {
    if (current === "science") {
      return (
        <>
          <div id="science">{Classes.SCIENCES.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "math") {
      return (
        <>
          <div id="math">{Classes.MATH.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "history") {
      return (
        <>
          <div id="history">{Classes.HISTORY.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "english") {
      return (
        <>
          <div id="english">{Classes.ENGLISH.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "lang") {
      return (
        <>
          <div id="world_language">
            {Classes.WORLD_LANGS.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "njrotc") {
      return (
        <>
          <div id="njrotc">{Classes.NJROTC.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "compsci") {
      return (
        <>
          <div id="compsci">{Classes.COMPSCI.map((x) => checkbox(x))}</div>
        </>
      );
    } else if (current === "main") {
      return (
        <>
          <div id="main">
            {Object.keys(classes).map((key, index) => {
              console.log(classes);
              if (classes[key]) {
                return checkbox(key);
              } else {
                return <></>;
              }
            })}
          </div>
        </>
      );
    }
  }

  //Returns the class selectors and checkboxes in a <div>
  return (
    <div className="class-container">
      {classSelect()}
      {showBoxes()}
    </div>
  );
}
