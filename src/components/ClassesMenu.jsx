import { useState } from "react";
import * as Classes from "../constants/classes";
import "./ClassesMenu.css";

export default function ClassesMenu(props) {
  const [classes, setClasses] = useState({});
  const [current, setCurrent] = useState("main");
  const handleClassChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const boxss = target.name;
    if (value !== undefined) {
      setClasses({ ...classes, [boxss]: value });
      props.classSelect({ ...classes, [boxss]: value });
    }
    console.log(boxss);
  };

  function checkbox(x) {
    return (
      <div className="class-checkbox" style={{ display: "inline" }}>
        {" "}
        <input
          className="class-check"
          style={{ display: "inline" }}
          type="checkbox"
          name={x}
          id={x + "-box"}
          onChange={handleClassChange}
          checked={classes[x] !== undefined && classes[x] === true}
        ></input>{" "}
        <label
          className="class-label"
          style={{ display: "inline", userSelect: "none" }}
          htmlFor={x}
        >
          {x}
        </label>
        <br />
      </div>
    );
  }

  function classButton(className) {
    return (
      <button
        className="class-button"
        onClick={() => {
          setCurrent(className);
        }}
      >
        {className.charAt(0).toUpperCase() + className.slice(1)}
      </button>
    );
  }

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
    }
  }

  return (
    <div className="class-container">
      {classSelect()}
      {showBoxes()}
    </div>
  );
}
