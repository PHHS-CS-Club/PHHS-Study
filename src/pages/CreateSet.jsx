import { uuidv4 } from "@firebase/util";
import React from "react";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import * as mke from "mathkeyboardengine";
import { TiDelete } from "react-icons/ti";
import "./CreateSet.css";
import * as Classes from "../constants/classes";

export default function CreateSet() {
  const { user } = UserAuth();
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [classes, setClasses] = useState({});
  const [mathModes, setMathModes] = useState({});
  let latexConfiguration = new mke.LatexConfiguration();
  let keyboardMemory = new mke.KeyboardMemory();

  const createCard = () => {
    const list = cards.concat({
      id: uuidv4(),
      front: "",
      back: "",
    });
    setCards(list);
  };

  const handleClassChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const boxss = target.name;
    if (value !== undefined) {
      setClasses({ ...classes, [boxss]: value });
    }
    console.log(boxss);
  };

  const handleMathMode = (event) => {
    const target = event.target;
    const value = target.checked;
    const boxss = target.name;
    if (value !== undefined) {
      setMathModes({ ...mathModes, [boxss]: value });
    }
  };

  const logMathMode = () => {
    console.log(cards);
  };

  function checkbox(x) {
    return (
      <div style={{ display: "inline" }}>
        {" "}
        <input
          style={{ display: "inline" }}
          type="checkbox"
          name={x}
          id={x + "-box"}
          onChange={handleClassChange}
        ></input>{" "}
        <label style={{ display: "inline", userSelect: "none" }} htmlFor={x}>
          {x}
        </label>
        <br />
      </div>
    );
  }

  function writeSet() {
    if (cards.length !== 0) {
      let newId = uuidv4();
      set(ref(database, newId), {
        cards,
      });
      let trueClasses = [];
      Object.keys(classes).forEach((x) => {
        if (classes[x] === true) {
          trueClasses.push(x);
        }
      });
      console.log(trueClasses);
      set(ref(database, "flashcard-sets/" + newId), {
        Author: user.uid,
        Name: name,
        Classes: trueClasses,
      });
      setCards([]);
      setName("");
    } else {
      alert("You must add a card");
    }
  }

  function updateFront(text, id) {
    const list = cards.map((card) => {
      if (card.id === id) {
        return {
          id: card.id,
          front: text,
          back: card.back,
        };
      }
      return card;
    });
    setCards(list);
  }
  function updateFrontMath(id, mathMode) {
    const list = cards.map((card) => {
      if (card.id === id) {
        return {
          id: card.id,
          front: card.front,
          back: card.back,
          mathModeFront: mathMode,
          mathModeBack: card.mathModeBack,
        };
      }
      return card;
    });
    setCards(list);
  }
  function updateBackMath(id, mathMode) {
    const list = cards.map((card) => {
      if (card.id === id) {
        return {
          id: card.id,
          front: card.front,
          back: card.back,
          mathModeBack: mathMode,
          mathModeFront: card.mathModeFront,
        };
      }
      return card;
    });
    setCards(list);
  }

  function updateBack(text, id) {
    const list = cards.map((card) => {
      if (card.id === id) {
        return {
          id: card.id,
          front: card.front,
          back: text,
        };
      }
      return card;
    });
    setCards(list);
  }

  function mathModeButtons(card, frontBack, id) {
    return (
      <>
        <input
          id={frontBack + id}
          style={{
            position: "absolute",
            zIndex: "2",
            left: "230px",
            bottom: "-2px",
          }}
          checked={
            frontBack === "front" ? card.mathModeFront : card.mathModeBack
          }
          type="checkbox"
          name={frontBack + id}
          onChange={(event) => {
            if (frontBack === "front") {
              console.log("upd " + id + ": to " + event.target.checked);
              updateFrontMath(card.id, event.target.checked);
            } else if (frontBack === "back") {
              updateBackMath(card.id, event.target.checked);
            }
          }}
        />
        <label
          style={{
            position: "absolute",
            fontSize: "10px",
            left: "250px",
            bottom: "0px",
            zIndex: "2",
            userSelect: "none",
          }}
          htmlFor={frontBack + id}
        >
          Math Mode
        </label>
      </>
    );
  }

  function genCardBox(card, frontBack, id) {
    if (frontBack === "front" && card.mathModeFront === true) {
      return (
        <>
          <InlineMath>{card.front}</InlineMath>
          {mathModeButtons(card, frontBack, id)}
        </>
      );
    } else if (frontBack === "back" && card.mathModeBack === true) {
      return (
        <>
          <InlineMath>{card.back}</InlineMath>
          {mathModeButtons(card, frontBack, id)}
        </>
      );
    } else {
      return (
        <>
          <textarea
            type="text"
            placeholder={frontBack.charAt(0).toUpperCase() + frontBack.slice(1)}
            className={frontBack + "-side"}
            id={frontBack}
            value={frontBack === "front" ? card.front : card.back}
            onChange={(event) => {
              if (frontBack === "front") {
                updateFront(event.target.value, card.id);
              } else if (frontBack === "back") {
                updateBack(event.target.value, card.id);
              }
            }}
          />

          {mathModeButtons(card, frontBack, id)}
        </>
      );
    }
  }

  const deleteCard = (id) => {
    setCards((old) => {
      return old.filter((card) => id !== card.id);
    });
  };

  return (
    <>
      <div className="create-set-container">
        <textarea
          type="text"
          placeholder="Name set"
          id="name-set"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <br />
        {cards.map((card, i) => {
          return (
            <div
              style={{
                display: "flex",
                width: "630px",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              key={card.id}
            >
              {" "}
              <div
                style={{
                  display: "inline",
                  position: "relative",
                  border: "1px solid",
                  padding: "2px",
                  textAlign: "center",
                  height: "100px",
                  width: "300px",
                  boxShadow: "3px 3px 3px 1px rgb(196, 196, 196)",
                }}
              >
                {genCardBox(card, "front", i)}
              </div>
              <div
                style={{
                  display: "inline",
                  position: "relative",
                  border: "1px solid",
                  padding: "2px",
                  textAlign: "center",
                  height: "100px",
                  width: "300px",
                  boxShadow: "3px 3px 3px 1px rgb(196, 196, 196)",
                }}
              >
                {genCardBox(card, "back", i)}
              </div>
              <TiDelete
                size="20"
                className="delete-button"
                onClick={() => deleteCard(card.id)}
              ></TiDelete>
            </div>
          );
        })}
        <br />
        <button className="add-card-button" onClick={createCard}>
          Add card
        </button>
        {cards.length !== 0 ? (
          <button className="create-set-button" onClick={() => writeSet()}>
            Create Set
          </button>
        ) : (
          <div className="add-card-message">Please add a card</div>
        )}
      </div>
      <br />
      <div style={{ textAlign: "center", fontWeight: "600", fontSize: "20px" }}>
        Classes
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div id="science" style={{ display: "inline", margin: "5px" }}>
          <div>Science</div>
          <br />
          {Classes.SCIENCES.map((x) => checkbox(x))}
        </div>
        <div id="history" style={{ display: "inline", margin: "5px" }}>
          <div>History</div>
          <br />
          {Classes.HISTORY.map((x) => checkbox(x))}
        </div>
        <div id="math" style={{ display: "inline", margin: "5px" }}>
          <div>Math</div>
          <br />
          {Classes.MATH.map((x) => checkbox(x))}
        </div>
        <div id="english" style={{ display: "inline", margin: "5px" }}>
          <div>English</div>
          <br />
          {Classes.ENGLISH.map((x) => checkbox(x))}
        </div>
        <div id="world_language" style={{ display: "inline", margin: "5px" }}>
          <div>World Languages</div>
          <br />
          {Classes.WORLD_LANGS.map((x) => checkbox(x))}
        </div>
        <div id="njrotc" style={{ display: "inline", margin: "5px" }}>
          <div>NJROTC</div>
          <br />
          {Classes.NJROTC.map((x) => checkbox(x))}
        </div>
        <div id="compsci" style={{ display: "inline", margin: "5px" }}>
          <div>Comp Sci</div>
          <br />
          {Classes.COMPSCI.map((x) => checkbox(x))}
        </div>
      </div>
    </>
  );
}
