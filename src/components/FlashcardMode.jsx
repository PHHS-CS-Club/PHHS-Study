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
import PulseLoader from "react-spinners/PulseLoader";

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
	const [userStatus, setUserStatus] = useState({});
	const [updateDB, setUpdateDB] = useState(false);
	const [currentCard, setCurrentCard] = useState();
	const [flipped, setFlipped] = useState(false);
	const [needNew, setNeedNew] = useState(true);
	const { user } = UserAuth();
	const { id } = useParams();
	const [singleBucket, setSingleBucket] = useState(-1);

	const cardIds = useMemo(() => {
		let ids = [];
		props.cards.forEach((c) => ids.push(c.id));
		return ids;
	}, [props.cards]);

	const currentId = useMemo(() => {
		if (currentCard != null) {
			return currentCard.id;
		}
		return null;
	}, [currentCard]);

	const getCard = useCallback(() => {
		// Applies a weight according to the bucket const
		// Sums weights, generates a random value for them,
		// then grabs card once sum reaches the random num
		if (props.cards != null) {
			let sum = 0;
			props.cards.forEach((c) => {
				if (
					(singleBucket === -1 ||
						singleBucket === userStatus[c.id]) &&
					c.id !== currentId
				) {
					sum += buckets[userStatus[c.id] - 1];
				}
			});
			if (sum === 0) {
				if (
					props.cards.filter((e) => userStatus[e.id] === singleBucket)
						.length === 0
				) {
					setCurrentCard(nullCard);
				}
			} else {
				let index = Math.random() * sum;
				sum = 0;
				let BreakException = {};
				try {
					props.cards.forEach((c) => {
						if (
							(singleBucket === -1 ||
								singleBucket === userStatus[c.id]) &&
							c.id !== currentId
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
	}, [props.cards, userStatus, singleBucket, currentId]);

	useEffect(() => {
		if (user) {
			const dbRef = ref(
				database,
				"users/" + user.uid + "/" + props.setid
			);
			onValue(
				dbRef,
				async (snapshot) => {
					const data = await snapshot.val();
					if (data != null) {
						setUserStatus(data);
					}
				},
				{
					onlyOnce: true,
				}
			);
		}
	}, [user, props]);

	useEffect(() => {
		let temp = { ...userStatus };
		if (props.cards != null) {
			props.cards.forEach((c) => {
				if (temp[c.id] == null) {
					temp = { ...temp, [c.id]: 1 };
				}
			});
		}
		if (temp != null) {
			Object.entries(temp).forEach((s) => {
				if (!cardIds.includes(s[0])) {
					temp = { ...temp, [s[0]]: null };
				}
			});
		}
		if (JSON.stringify(temp) !== JSON.stringify(userStatus)) {
			setUserStatus(temp);
		}
	}, [props.cards, userStatus, cardIds]);

	useEffect(() => {
		if (user != null && userStatus != null && props != null && updateDB) {
			const dbRef = ref(
				database,
				"users/" + user.uid + "/" + props.setid
			);
			set(dbRef, userStatus);
			setUpdateDB(false);
		}
	}, [userStatus, props, user, updateDB]);

	useEffect(() => {
		if (needNew) {
			getCard();
			setNeedNew(false);
		}
	}, [needNew, getCard]);

	useEffect(() => {
		setNeedNew(true);
	}, [userStatus]);

	//Deletes progress
	const resetProgress = () => {
		if (user?.displayName !== undefined) {
			remove(ref(database, "users/" + user.uid + "/" + id));
		}
		setUserStatus({});
		setUpdateDB(true);
	};

	const handleIncorrect = useCallback(() => {
		if (currentId) {
			setUserStatus({
				...userStatus,
				[currentId]: Math.max(1, userStatus[currentId] - 1),
			});
			setFlipped(false);
			setUpdateDB(true);
		}
	}, [currentId, userStatus]);

	const handleCorrect = useCallback(() => {
		if (currentId) {
			setUserStatus({
				...userStatus,
				[currentId]: Math.min(userStatus[currentId] + 1, 5),
			});
			setFlipped(false);
			setUpdateDB(true);
		}
	}, [currentId, userStatus]);

	const flipCard = useCallback(() => {
		setFlipped(!flipped);
	}, [flipped]);

	const changeBucket = (index) => {
		setSingleBucket(singleBucket === index + 1 ? -1 : index + 1);
		setNeedNew(true);
		setFlipped(false);
	};

	const bucketItem = useCallback(
		(cardid) => {
			return (
				<GoDotFill
					key={cardid}
					className={
						currentId === cardid ? "yellow-dot" : "green-dot"
					}
				/>
			);
		},
		[currentId]
	);

	useEffect(() => {
		const detectKeyDown = (e) => {
			switch (e.key) {
				case " ":
					flipCard();
					break;
				case "Backspace":
					handleIncorrect();
					break;
				case "Enter":
					handleCorrect();
					break;
				default:
					break;
			}
		};

		document.addEventListener("keydown", detectKeyDown);
		return () => document.removeEventListener("keydown", detectKeyDown);
	}, [flipCard, handleIncorrect, handleCorrect]);

	if (props.cards.length === 0) {
		return (
			<>
				<PulseLoader
					style={{ margin: "10px" }}
					loading={true}
					speedMultiplier={0.8}
					margin={6}
				/>
			</>
		);
	} else {
		return (
			<div className="flashcard-mode-body">
				<div className="cl-container">
					<div className="current-level">
						{currentCard
							? "Card level: " + userStatus[currentCard?.id]
							: ""}
					</div>
					<button
						className="reset-prog-button"
						onClick={resetProgress}
					>
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
						flip={flipCard}
						flipped={flipped}
					/>
					<div
						className={
							"fs-buttons" +
							(flipped ? " flipped-b" : " unflipped-b")
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
									(singleBucket === index + 1
										? "single "
										: "") +
									"bucket-" +
									(index + 1) +
									" bucket "
								}
								onClick={() => changeBucket(index)}
							>
								<div className="bucket-title">
									Bucket {index + 1}
								</div>
								<div className="bucket-holder">
									{Object.entries(userStatus).map(
										(card, i) => {
											return card[1] === index + 1 ? (
												<div
													className="dot-holder"
													key={i + " " + index}
												>
													{bucketItem(card[0])}
												</div>
											) : (
												<Fragment
													key={card[0] + (index + 1)}
												/>
											);
										}
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
