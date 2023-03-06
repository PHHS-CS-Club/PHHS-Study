import React from "react";
import { useState, useEffect } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardMode(props) {
  //eslint-disable-next-line
  const [cards, setCards] = useState(() => props.cards.map((item) => item));
  const [currentCard, setCurrentCard] = useState({});
  const [currentBucket, setCurrentBucket] = useState(1);
  const [flipped, setFlipped] = useState(false);

  useState(() => {
    initial();
    let keys = Object.keys(cards);
    setCurrentCard(cards[keys[Math.floor(Math.random() * keys.length)]]);
  }, [cards]);

  function initial() {
    var arr = props.cards;
    arr.forEach((c, i) => {
      arr[i] = { ...c, bucket: 1, index: i };
    });
    setCards(arr);
  }

  function getNewCard() {
    let arr = cards.filter((x) => {
      console.log(x);
      return x.id !== currentCard.id && x.bucket === currentBucket;
    });
    let i = 0;
    while (arr.length < 1 && i < 100) {
      console.log("in loop");
      let newBucket = pickBucket(false);
      console.log(newBucket);
      arr = cards.filter((x) => {
        console.log(x);
        console.log(x.id !== currentCard.id);
        console.log(x.bucket === newBucket);
        return x.id !== currentCard.id && x.bucket === newBucket;
      });
      i++;
    }
    setCurrentCard(arr[Math.floor(Math.random() * arr.length)]);
  }

  const handleCorrect = () => {
    var arr = cards;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === currentCard.id) {
        if (arr[i].bucket < 5) {
          arr[i] = { ...arr[i], bucket: arr[i].bucket + 1 };
        }
      }
    }

    setCards(arr);
    setCurrentBucket(pickBucket(false));
    getNewCard();
  };

  const handleIncorrect = () => {
    var arr = cards;
    arr.forEach((c, i) => {
      if (c.id === currentCard.id) {
        if (c.bucket > 1) {
          arr[i] = { ...c, bucket: c.bucket - 1 };
        }
      }
    });
    setCards(arr);
    setCurrentBucket(pickBucket(false));
    getNewCard();
  };

  function pickBucket(notSame) {
    let buckets = [0, 0, 0, 0, 0];
    cards.forEach((x) => {
      for (let i = 0; i < buckets.length; i++) {
        if (x.bucket === i + 1) {
          buckets[i] += 1;
        }
      }
    });
    let weights = [
      buckets[0] > 0 ? 100 : 0,
      buckets[1] > 0 ? 50 : 0,
      buckets[2] > 0 ? 25 : 0,
      buckets[3] > 0 ? 12.5 : 0,
      buckets[4] > 0 ? 6.25 : 0,
    ];
    if (notSame) weights[currentBucket - 1] = 0;
    console.log(weights);
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
    }
    let random = Math.floor(Math.random() * sum);
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i + 1;
      }
      random -= weights[i];
    }
  }

  return (
    <div className="card-container-fsm">
      <Flashcard
        question={currentCard?.front}
        answer={currentCard?.back}
        mFront={currentCard?.mathModeFront}
        mBack={currentCard?.mathModeBack}
        flip={() => setFlipped(!flipped)}
        current={false}
      />
      {flipped ? (
        <>
          <button onClick={handleCorrect}>Correct</button>
          <button onClick={handleIncorrect}>Incorrect</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
