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
  //remove after using these
  /* eslint-disable */
  let latexConfiguration = new mke.LatexConfiguration();
  let keyboardMemory = new mke.KeyboardMemory();
  /* eslint-enable */
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
          mathModeFront: card.mathModeFront,
          mathModeBack: card.mathModeBack,
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
          mathModeFront: card.mathModeFront,
          mathModeBack: card.mathModeBack,
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
            right: "485px",
            top: "-18px",
          }}
          checked={
            (frontBack === "front" && card?.mathModeFront) ||
            (frontBack === "back" && card?.mathModeBack)
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
            right: "432px",
            top: "-13px",
            zIndex: "2",
            userSelect: "none",
          }}
          htmlFor={frontBack + id}
        >
          Math Mode
        </label>
        {/*frontBack === "back" ? (
          
        ) : (
          <></>
        )*/}
      </>
    );
  }

  function genCardBox(card, frontBack, id) {
    if (frontBack === "front" && card.mathModeFront === true) {
      return (
        <>
          <div style={{overflow: "auto", height: "100%"}}>
            <InlineMath  
            className="katex-display" 
            math={card.front} 
            maxExpand="5"
            >
            </InlineMath>
          </div>
          {mathModeButtons(card, frontBack, id)}
        </>
      );
    } else if (frontBack === "back" && card.mathModeBack === true) {
      return (
        <>
          <InlineMath style={{ position: "relative" }}>{card.back}</InlineMath>
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
      <button
        onClick={() => {
          console.log(cards);
        }}
      >
        log
      </button>
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
                justifyContent: "stretch",
                alignItems: "center",
                margin: "10px",
              }}
              key={card.id}
            >
              <TiDelete
                size="20"
                className="delete-button"
                onClick={() => deleteCard(card.id)}
              ></TiDelete>{" "}
              <div
                style={{
                  display: "inline",
                  position: "relative",
                  border: "1px solid",
                  padding: "2px",
                  textAlign: "center",
                  height: "200px",
                  width: "500px",
                  margin: "5px",
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
                  height: "200px",
                  width: "500px",
                  margin: "5px",
                  boxShadow: "3px 3px 3px 1px rgb(196, 196, 196)",
                }}
              >
                {genCardBox(card, "back", i)}
              </div>
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
