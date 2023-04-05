import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Flashcard from "./Flashcard";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import "./FlashcardMode.css";
import { Fragment } from "react";
import { database } from "../firebase-config";
import { ref, onValue, set } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function FlashcardMode(props) {
  //eslint-disable-next-line
  const [cards, setCards] = useState(() => props.cards.map((item) => item));
  const [currentCard, setCurrentCard] = useState({});
  const [currentBucket, setCurrentBucket] = useState(1);
  const [flipped, setFlipped] = useState(false);
  const { user } = UserAuth();
  const { id } = useParams();
  const cardRef = useRef();

  useEffect(() => {
    initial();
    let keys = Object.keys(cards);
    setCurrentCard(cards[keys[Math.floor(Math.random() * keys.length)]]);
    //eslint-disable-next-line
  }, []);

  function initial() {
    if (user !== null && user !== undefined) {
      onValue(
        ref(database, "users/" + user.uid + "/" + id),
        (snapshot) => {
          if (snapshot.val() !== null && snapshot.val() !== undefined) {
            setCards(snapshot.val());
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      var arr = props.cards;
      arr.forEach((c, i) => {
        arr[i] = { ...c, bucket: 1, index: i };
      });
      setCards(arr);
    }
  }

  function getNewCard() {
    let arr = cards.filter((x) => {
      return x.id !== currentCard.id && x.bucket === currentBucket;
    });
    let i = 0;
    while (arr.length < 1 && i < 100) {
      let newBucket = pickBucket(false);
      arr = cards.filter((x) => {
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
    setFlipped(!flipped);
    cardRef.current.setFlipped(!flipped);
    if (
      user !== null &&
      user !== undefined &&
      cards !== undefined &&
      cards !== null
    ) {
      set(ref(database, "users/" + user.uid + "/" + id), cards);
    }
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
    setFlipped(!flipped);
    cardRef.current.setFlipped(!flipped);
    if (
      user !== null &&
      user !== undefined &&
      cards !== undefined &&
      cards !== null
    ) {
      set(ref(database, "users/" + user.uid + "/" + id), cards);
    }
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
      buckets[0] > 0 ? 400 : 0,
      buckets[1] > 0 ? 50 : 0,
      buckets[2] > 0 ? 25 : 0,
      buckets[3] > 0 ? 12.5 : 0,
      buckets[4] > 0 ? 6.25 : 0,
    ];
    if (notSame) weights[currentBucket - 1] = 0;
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

  const resetProgress = () => {
    var arr = props.cards;
    arr.forEach((c, i) => {
      arr[i] = { ...c, bucket: 1, index: i };
    });
    setCards(arr);
    set(ref(database, "users/" + user.uid + "/" + id), cards);
  };

  function bucketItem(cardid) {
    return <GoPrimitiveDot key={cardid} className="green-dot" />;
  }

  return (
    <div className="flashcard-mode-body">
      <div className="cl-container">
        <div className="current-level">Card level: {currentCard.bucket}</div>
        <button className="reset-prog-button" onClick={resetProgress}>
          Reset Progress
        </button>
      </div>

      <div className="card-container-fsm">
        <Flashcard
          question={currentCard?.front}
          answer={currentCard?.back}
          mFront={currentCard?.mathModeFront}
          mBack={currentCard?.mathModeBack}
          flip={() => {
            setFlipped(!flipped);
          }}
          ref={cardRef}
        />
        <div
          className={"fs-buttons" + (flipped ? " flipped-b" : " unflipped-b")}
        >
          <AiFillCloseCircle
            className={"card-incorrect" + (flipped ? " flipped" : " unflipped")}
            onClick={handleIncorrect}
          >
            Correct
          </AiFillCloseCircle>
          <AiFillCheckCircle
            className={"card-correct" + (flipped ? " flipped" : " unflipped")}
            onClick={handleCorrect}
          >
            Incorrect
          </AiFillCheckCircle>
        </div>
      </div>
      <div className="status-container">
        <div className="bucket-1 bucket">
          Bucket 1
          <div className="bucket-holder">
            {cards.map((card, i) => {
              return card.bucket === 1 ? (
                <div key={card.id + "1"}>{bucketItem()}</div>
              ) : (
                <Fragment key={card.id + "1"} />
              );
            })}
          </div>
        </div>
        <div className="bucket-2 bucket">
          Bucket 2
          <div className="bucket-holder">
            {cards.map((card, i) => {
              return card.bucket === 2 ? (
                <div key={card.id + "2"}>{bucketItem()}</div>
              ) : (
                <Fragment key={card.id + "2"} />
              );
            })}
          </div>
        </div>
        <div className="bucket-3 bucket">
          Bucket 3
          <div className="bucket-holder">
            {cards.map((card, i) => {
              return card.bucket === 3 ? (
                <div key={card.id + "3"}>{bucketItem()}</div>
              ) : (
                <Fragment key={card.id + "3"} />
              );
            })}
          </div>
        </div>
        <div className="bucket-4 bucket">
          Bucket 4
          <div className="bucket-holder">
            {cards.map((card, i) => {
              return card.bucket === 4 ? (
                <div key={card.id + "4"}>{bucketItem()}</div>
              ) : (
                <Fragment key={card.id + "4"} />
              );
            })}
          </div>
        </div>
        <div className="bucket-5 bucket">
          Bucket 5
          <div className="bucket-holder">
            {cards.map((card, i) => {
              return card.bucket === 5 ? (
                <div key={card.id + "5"}>{bucketItem()}</div>
              ) : (
                <Fragment key={card.id + "5"} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
