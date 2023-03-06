import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./Flashcard.css";

//https://www.youtube.com/watch?v=hEtZ040fsD8&t=193s

const Flashcard = forwardRef((flashcard, ref) => {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");
  const [transitioning, setTransitioning] = useState(false);

  const frontEl = useRef();
  const backEl = useRef();

  useImperativeHandle(ref, () => ({
    async setFlipped(to) {
      setTransitioning(true);
      setFlip(to);
      console.log("upd flip to:" + to);
      await timeout(300);
      setTransitioning(false);
    },
  }));

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 400));
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.ans]);

  return (
    <>
      <div
        className={
          "card" +
          (flip ? " flip" : "") +
          (transitioning ? " trans" : " notrans")
        }
        style={{ height: height }}
        onClick={() => {
          setFlip(!flip);
          console.log("upd flip");
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
      <button
        onClick={() => {
          console.log(flip);
        }}
      >
        log
      </button>
    </>
  );
});

export default Flashcard;
