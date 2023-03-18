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
  const { id } = useParams();
  useEffect(() => {
    onValue(ref(database, id), (snapshot) => {
      const data = snapshot.val();
      setCards(data.cards);
    });
    onValue(ref(database, "flashcard-sets/" + id), (snapshot) => {
      const metaData = snapshot.val();
      setMetadata(metaData);
    });
  }, [id]);

  if (mode === "view") {
    return (
      <div>
        {/* Make these render new components for flashcard modes */}
        <button
          onClick={() => {
            setMode("Flashcard");
          }}
        >
          {" "}
          Flashcard mode{" "}
        </button>
        <button> Learn mode </button>
        <button> Flashcard games </button>
        {user?.uid === metadata?.AuthorID ? (
          <Link to={"/Edit/" + id}>Edits Set</Link>
        ) : (
          <></>
        )}
        {cards.map((card) => {
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
    );
  } else if (mode === "Flashcard") {
    return (
      <>
        <button
          onClick={() => {
            setMode("view");
          }}
        >
          {" "}
          Exit{" "}
        </button>
        <FlashcardMode cards={cards} />
      </>
    );
  }
}
