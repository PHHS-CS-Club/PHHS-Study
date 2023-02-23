import { uuidv4 } from "@firebase/util";
import React from "react";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import * as mke from "mathkeyboardengine";
import "./CreateSet.css";
import * as Classes from "../constants/classes";

export default function CreateSet() {
  const { user } = UserAuth();
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [classes, setClasses] = useState({});
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

  const handleChange = (event) => {
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
          onChange={handleChange}
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
        {cards.map((card) => {
          return (
            <div key={card.id}>
              {" "}
              <div style={{ display: "inline", position: "relative" }}>
                {" "}
                <textarea
                  type="text"
                  placeholder="Front"
                  id="front-side"
                  style={{ position: "relative", zIndex: "1" }}
                  onChange={(event) => updateFront(event.target.value, card.id)}
                />
                <input
                  id={"card-front-math-" + card}
                  style={{
                    position: "absolute",
                    zIndex: "2",
                    left: "230px",
                    top: "-2px",
                  }}
                  type="checkbox"
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "10px",
                    left: "250px",
                    top: "0px",
                    zIndex: "2",
                    userSelect: "none",
                  }}
                  htmlFor={"card-front-math-" + card}
                >
                  Math Mode
                </label>
              </div>
              <div style={{ display: "inline", position: "relative" }}>
                {" "}
                <textarea
                  type="text"
                  placeholder="Back"
                  id="back-side"
                  onChange={(event) => updateBack(event.target.value, card.id)}
                />
                <input
                  id={"card-back-math-" + card}
                  style={{
                    position: "absolute",
                    zIndex: "2",
                    left: "230px",
                    top: "-2px",
                  }}
                  type="checkbox"
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "10px",
                    left: "250px",
                    top: "0px",
                    zIndex: "2",
                    userSelect: "none",
                  }}
                  htmlFor={"card-back-math-" + card}
                >
                  Math Mode
                </label>
              </div>
              <button
                className="delete-button"
                onClick={() => deleteCard(card.id)}
              >
                Delete
              </button>
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
