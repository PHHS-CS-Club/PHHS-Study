import { uuidv4 } from "@firebase/util";
import React from "react";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import "./CreateSet.css";

export default function CreateSet() {
  const { user } = UserAuth();
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  function writeSet() {
    if (cards.length !== 0) {
      let newId = uuidv4();
      set(ref(database, newId), {
        cards,
      });
      set(ref(database, "flashcard-sets/" + newId), {
        Author: user.uid,
        Name: name,
        Classes: ["test class 1", "test class 2"],
      });
    } else {
      alert("You must add a card");
    }
  }

  const createCard = () => {
    const list = cards.concat({
      id: uuidv4(),
      front: "",
      back: "",
    });
    setCards(list);
  };

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
      <div class="create-set-container">
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
              <textarea
                type="text"
                placeholder="Front"
                id="front-side"
                onChange={(event) => updateFront(event.target.value, card.id)}
              />
              <textarea
                type="text"
                placeholder="Back"
                id="back-side"
                onChange={(event) => updateBack(event.target.value, card.id)}
              />
              <button class="delete-button" onClick={() => deleteCard(card.id)}>
                Delete
              </button>
            </div>
          );
        })}
        <br />
        <button class="add-card-button" onClick={createCard}>
          Add card
        </button>
        {cards.length !== 0 ? (
          <button class="create-set-button" onClick={() => writeSet()}>
            Create Set
          </button>
        ) : (
          <div class="add-card-message">Please add a card</div>
        )}
      </div>
    </>
  );
}
