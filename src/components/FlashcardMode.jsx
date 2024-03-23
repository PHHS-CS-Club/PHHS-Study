import React, { useEffect } from "react";
import { useState, useCallback, useMemo } from "react";
import Flashcard from "./Flashcard";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import "./FlashcardMode.css";
import { Fragment } from "react";
import { database } from "../firebase-config";
import { ref, onValue, set, remove } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const buckets = [500, 50, 5, 0.5, 0.1];

const nullCard = {
	back: "No Cards Available",
	front: "No Cards Available",
	id: null,
	mathModeBack: false,
	mathModeFront: false,
};

export default function FlashcardMode(props) {
	//eslint-disable-next-line
	const [cards, setCards] = useState(props.cards);
	const [userStatus, setUserStatus] = useState({});
	const [retrieved, setRetrieved] = useState(false);
	const [currentCard, setCurrentCard] = useState();
	const [flipped, setFlipped] = useState(false);
	const { user } = UserAuth();
	const { id } = useParams();
	const [singleBucket, setSingleBucket] = useState(-1);

	const cardIds = useMemo(() => {
		let ids = [];
		cards.forEach((c) => ids.push(c.id));
		return ids;
	}, [cards]);

	useEffect(() => {
		const dbRef = ref(database, "users/" + user.uid + "/" + props.setid);
		onValue(
			dbRef,
			async (snapshot) => {
				const data = await snapshot.val();
				if (data != null) {
					setUserStatus(data);
				}
				setRetrieved(true);
			},
			{
				onlyOnce: true,
			}
		);
	}, [user, props]);

	useEffect(() => {
		if (cards != null) {
			cards.forEach((c) => {
				if (userStatus[c.id] == null) {
					userStatus[c.id] = 1;
				}
			});
		}
		if (userStatus != null) {
			let temp = userStatus;
			Object.entries(temp).forEach((s) => {
				if (!cardIds.includes(s[0])) {
					temp[s[0]] = null;
				}
			});
		}
	}, [cards, userStatus, cardIds]);

	useEffect(() => {
		if (user != null && userStatus != null && props != null && retrieved) {
			const dbRef = ref(
				database,
				"users/" + user.uid + "/" + props.setid
			);
			set(dbRef, userStatus);
		}
	}, [userStatus, props, user, retrieved]);

	const getCard = useCallback(() => {
		// Applies a weight according to the bucket const
		// Sums weights, generates a random value for them,
		// then grabs card once sum reaches the random num
		if (cards != null) {
			let sum = 0;
			cards.forEach((c) => {
				if (singleBucket === -1 || singleBucket === userStatus[c.id]) {
					sum += buckets[userStatus[c.id] - 1];
				}
			});
			if (sum === 0) {
				setCurrentCard(nullCard);
			} else {
				let index = Math.random() * sum;
				sum = 0;
				let BreakException = {};
				try {
					cards.forEach((c) => {
						if (
							singleBucket === -1 ||
							singleBucket === userStatus[c.id]
						) {
							sum += buckets[userStatus[c.id] - 1];
						}
						if (sum > index) {
							setCurrentCard(c);
							throw BreakException;
						}
					});
				} catch (e) {
					if (e !== BreakException) throw e;
				}
			}
		}
	}, [cards, userStatus, singleBucket]);

	useEffect(() => {
		getCard();
	}, [getCard]);

	//Deletes progress
	const resetProgress = () => {
		if (user?.displayName !== undefined) {
			remove(ref(database, "users/" + user.uid + "/" + id));
		}
		setUserStatus({});
	};

	const handleIncorrect = () => {
		setUserStatus({
			...userStatus,
			[currentCard.id]: Math.max(1, userStatus[currentCard.id] - 1),
		});
		setFlipped(false);
	};

	const handleCorrect = () => {
		setUserStatus({
			...userStatus,
			[currentCard.id]: Math.min(userStatus[currentCard.id] + 1, 5),
		});
		setFlipped(false);
	};

	function bucketItem(cardid) {
		return <GoDotFill key={cardid} className="green-dot" />;
	}

	return (
		<div className="flashcard-mode-body">
			<div className="cl-container">
				<div className="current-level">
					Card level: {userStatus[currentCard?.id]}
				</div>
				<button className="reset-prog-button" onClick={resetProgress}>
					Reset Progress
				</button>
			</div>
			<div className="flip-status">{flipped ? "Back" : "Front"}</div>
			<div className="card-container-fsm">
				<Flashcard
					question={currentCard?.front}
					answer={currentCard?.back}
					mFront={currentCard?.mathModeFront}
					mBack={currentCard?.mathModeBack}
					flip={() => {
						setFlipped(!flipped);
					}}
					flipped={flipped}
				/>
				<div
					className={
						"fs-buttons" + (flipped ? " flipped-b" : " unflipped-b")
					}
				>
					{window.innerWidth > 600 || flipped ? (
						<>
							<AiFillCloseCircle
								className={
									"card-incorrect" +
									(flipped ? " flipped" : " unflipped")
								}
								onClick={handleIncorrect}
							>
								Correct
							</AiFillCloseCircle>
							<AiFillCheckCircle
								className={
									"card-correct" +
									(flipped ? " flipped" : " unflipped")
								}
								onClick={handleCorrect}
							>
								Incorrect
							</AiFillCheckCircle>
						</>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="bucket-text">
				Click on a bucket to only get cards from that bucket
			</div>
			<div className="status-container">
				{/* creates an empty array to loop 5 times for each bucket */}
				{Array.apply(null, { length: 5 }).map((el, index) => {
					return (
						<div
							key={index}
							className={
								(singleBucket === index + 1 ? "single " : "") +
								"bucket-" +
								(index + 1) +
								" bucket "
							}
							onClick={() => {
								setSingleBucket(
									singleBucket === index + 1 ? -1 : index + 1
								);
							}}
						>
							<div className="bucket-title">
								Bucket {index + 1}
							</div>
							<div className="bucket-holder">
								{Object.entries(userStatus).map((card, i) => {
									return card[1] === index + 1 ? (
										<div
											className="dot-holder"
											key={i + " " + index}
										>
											{bucketItem()}
										</div>
									) : (
										<Fragment key={card[0] + (index + 1)} />
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
