import React from "react";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";

export default function ViewSet() {
  const [cards, setCards] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    onValue(ref(database, id), (snapshot) => {
      const data = snapshot.val();
      console.log(data.cards);
      setCards(data.cards);
    });
  }, [id]);

  console.log(cards);
  return (
    <div>
      {cards.map((card) => {
        return (
          <>
            <div>{card.front}</div>
            <div>{card.back}</div>
          </>
        );
      })}
    </div>
  );
}
