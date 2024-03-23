import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./Flashcard.css";

//Watch this video to see how I made the flashcard styling
//https://www.youtube.com/watch?v=hEtZ040fsD8&t=193s

export default function Flashcard(props) {
	return (
		<>
			<div
				className={
					"card" + (props.flipped ? " flip" : "")
					//(transitioning ? " trans" : " notrans")
				}
				//style={{ height: height }}
				onClick={() => {
					props.flip();
				}}
			>
				{!props.flipped ? (
					props.mFront ? (
						<div className="front">
							<div className="front-text">
								{" "}
								<InlineMath>{props.question}</InlineMath>
							</div>
						</div>
					) : (
						<div className="front">
							<div className="front-text"> {props.question}</div>
						</div>
					)
				) : props.mBack ? (
					<div className="back">
						<div className="back-text">
							{" "}
							<InlineMath>{props.answer}</InlineMath>
						</div>
					</div>
				) : (
					<div className="back">
						<div className="back-text"> {props.answer}</div>
					</div>
				)}
			</div>
		</>
	);
}
