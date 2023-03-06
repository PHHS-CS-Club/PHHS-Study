import React, { useState, useEffect, useRef } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./Flashcard.css";

//https://www.youtube.com/watch?v=hEtZ040fsD8&t=193s

export default function Flashcard(flashcard) {
  const [flip, setFlip] = useState(flashcard.current);
  const [height, setHeight] = useState("initial");

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
    console.log(height);
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.ans]);

  return (
    <div
      className={"card" + (flip ? " flip" : "")}
      style={{ height: height }}
      onClick={() => {
        setFlip(!flip);
        flashcard.flip();
      }}
    >
      {flashcard.mFront ? (
        <div className="front" ref={frontEl}>
          <InlineMath>{flashcard.question}</InlineMath>
        </div>
      ) : (
        <div className="front" ref={frontEl}>
          {flashcard.question}
        </div>
      )}

      {flashcard.mBack ? (
        <div className="back" ref={backEl}>
          <InlineMath>{flashcard.answer}</InlineMath>
        </div>
      ) : (
        <div className="back" ref={backEl}>
          {flashcard.answer}
        </div>
      )}
    </div>
  );
}
