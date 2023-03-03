import React from "react";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./ViewSet.css";

export default function ViewSet() {
  const [cards, setCards] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    onValue(ref(database, id), (snapshot) => {
      const data = snapshot.val();
      setCards(data.cards);
    });
  }, [id]);

  return (
    <div>
      {/* Make these render new components for flashcard modes */}
      <button> Flashcard mode </button>
      <button> Learn mode </button>
      <button> Flashcard games </button>
      {cards.map((card) => {
        return (
          <div className="card-container">
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
}
