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
        onClick={() => {
          setCurrent(className);
        }}
      >
        {className.charAt(0).toUpperCase() + className.slice(1)}
      </button>
    );
  }

  function backbutton() {
    return (
      <button
        onClick={() => {
          setCurrent("main");
        }}
      >
        Back
      </button>
    );
  }

  function classSelect() {
    return (
      <>
        <div>Pick Classes</div>
        {classButton("math")}
        {classButton("science")}
        {classButton("english")}
        {classButton("history")}
        {classButton("lang")}
        {classButton("njrotc")}
        {classButton("compsci")}
      </>
    );
  }

  function showBoxes() {
    if (current === "science") {
      return (
        <>
          <div id="science" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.SCIENCES.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "math") {
      return (
        <>
          <div id="math" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.MATH.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "history") {
      return (
        <>
          <div id="history" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.HISTORY.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "english") {
      return (
        <>
          <div id="english" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.ENGLISH.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "lang") {
      return (
        <>
          <div id="world_language" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.WORLD_LANGS.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "njrotc") {
      return (
        <>
          <div id="njrotc" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.NJROTC.map((x) => checkbox(x))}
          </div>
        </>
      );
    } else if (current === "compsci") {
      return (
        <>
          <div id="compsci" style={{ display: "inline", margin: "5px" }}>
            <br />
            {Classes.COMPSCI.map((x) => checkbox(x))}
          </div>
        </>
      );
    }
  }

  return (
    <div className="class-container">
      {classSelect()}
      {backbutton()}
      {showBoxes()}
    </div>
  );
}
