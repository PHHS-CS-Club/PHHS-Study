import React from "react";
import { Link, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./ViewSet.css";
import FlashcardMode from "../components/FlashcardMode";

export default function ViewSet() {
  const { user } = UserAuth();
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState("view");
  const [metadata, setMetadata] = useState({});
  //Gets the id from the set
  const { id } = useParams();
  //Gets the flashcard data to display
  useEffect(() => {
    //gets the cards
    onValue(ref(database, id), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCards(data.cards);
      }
    });

    //Gets the metaData
    onValue(ref(database, "flashcard-sets/" + id), (snapshot) => {
      const metaData = snapshot.val();
      setMetadata(metaData);
    });
  }, [id]);

  //Based on the current mode, it will display different modes located in the components
  //View mode is the default mode set when opening the page
  if (mode === "view") {
    return (
      <div>
        <div className="flashcard-metadata">
          <div className="viewset-title">
            {/**Title */}
            {metadata.Name}
            {/**If user owns the set creates an edit button */}
            {user?.uid === metadata?.AuthorID ? (
              <Link to={"/Edit/" + id}>
                <button className="vsedit-button">Edit Set</button>
              </Link>
            ) : (
              <></>
            )}
          </div>
          {/**Author */}
          <div className="viewset-author">Created By {metadata.Author}</div>
          {/**Classes */}
          <div className="viewset-classes">
            <div className="viewset-infopart">Classes: </div>
            {metadata.Classes?.map((clas, i) => {
              return <div className="item-viewset">{clas}</div>;
            })}
          </div>
          {/**Teachers */}
          <div className="viewset-teachers">
            <div className="viewset-infopart">Teachers: </div>
            {metadata.Teachers?.map((clas, i) => {
              return <div className="item-viewset">{clas}</div>;
            })}
          </div>
        </div>

        <div className="viewset-button-wrapper">
          {/**Sets mode to flashcard */}
          <button
            className="viewset-buttons"
            onClick={() => {
              setMode("Flashcard");
            }}
          >
            Flashcard mode
          </button>
          {/* Make these change mode for new components for flashcard modes */}
          {/*<button className="viewset-buttons"> Learn mode </button>
          <button className="viewset-buttons"> Flashcard games </button> */}
        </div>

        {/**Displays all the cards */}
        <div className="viewset-card-title">Cards</div>
        <div className="cards-viewer">
          {cards?.map((card) => {
            return (
              <div key={card.id} className="card-container">
                {card.mathModeFront ? (
                  <div className="view-front">
                    <InlineMath>{card.front}</InlineMath>
                  </div>
                ) : (
                  <div className="view-front">{card.front}</div>
                )}
                {card.mathModeBack ? (
                  <div className="view-back">
                    <InlineMath>{card.back}</InlineMath>
                  </div>
                ) : (
                  <div className="view-back">{card.back}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
    //If mode is set to Flashcard, renders the FlashcardMode component on the page
  } else if (mode === "Flashcard") {
    return (
      <div className="flashcard-mode-container">
        <button
          className="exit-fsmode-button"
          onClick={() => {
            setMode("view");
          }}
        >
          Exit Flashcard Mode
        </button>
        <FlashcardMode cards={cards} />
      </div>
    );
  }
}
