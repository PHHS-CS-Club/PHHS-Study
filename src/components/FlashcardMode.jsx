import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Flashcard from "./Flashcard";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import "./FlashcardMode.css";
import { Fragment } from "react";
import { database } from "../firebase-config";
import { ref, onValue, set, remove } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function FlashcardMode(props) {
	//eslint-disable-next-line
	const [cards, setCards] = useState(() => props.cards.map((item) => item));
	const [currentCard, setCurrentCard] = useState();
	const [currentBucket, setCurrentBucket] = useState(1);
	const [flipped, setFlipped] = useState(false);
	const { user } = UserAuth();
	const { id } = useParams();
	const cardRef = useRef();
	const [singleBucketMode, setSingleBucketMode] = useState(false);
	const [singleBucket, setSingleBucket] = useState(1);

	const nullCard = {
		back: "No Cards Available",
		front: "No Cards Available",
		id: null,
		mathModeBack: false,
		mathModeFront: false,
	};

	useEffect(() => {
		initial();
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		getNewCard();
		cardRef.current?.setFlipped(false);
		setFlipped(false);
		//eslint-disable-next-line
	}, [singleBucketMode, singleBucket, cards]);

	//Initializes the cards
	async function initial() {
		//If there is a user it will attempt to get user data
		if (user !== null && user !== undefined) {
			onValue(
				ref(database, "users/" + user.uid + "/" + id),
				async (snapshot) => {
					//If it gets null data then it will default set it
					if (
						snapshot.val() !== null &&
						snapshot.val() !== undefined
					) {
						//Gets array data
						var arr = snapshot.val();
						//Sets each card to the card object with their bucket and index
						props.cards.forEach((c, i) => {
							if (arr.filter((e) => e.id === c.id).length > 0) {
								let index = arr.findIndex((e) => e.id === c.id);
								arr[index] = {
									...c,
									bucket: arr[index].bucket,
								};
							} else {
								arr.push({ ...c, bucket: 1 });
							}
						});

						arr.forEach((c, i) => {
							if (
								props.cards.filter((e) => e.id === c.id)
									.length === 0
							) {
								arr.pop(i);
							}
						});

						//Sets cards
						await setCards(arr);
						//Sets current to a random card
						getNewCard();
					} else {
						//Gets cards
						arr = props.cards;
						//Sets buckets and index
						arr.forEach((c, i) => {
							arr[i] = { ...c, bucket: 1, index: i };
						});
						//Sets cards
						await setCards(arr);
						//Sets current to a random card
						getNewCard();
					}
				},
				{
					onlyOnce: true,
				}
			);
		} else {
			//Gets cards and sets all to bucket 1
			var arr = props.cards;
			arr.forEach((c, i) => {
				arr[i] = { ...c, bucket: 1, index: i };
			});
			//Sets cards
			await setCards(arr);
			//Sets current to a random card
			getNewCard();
		}
	}

	//Sets current
	function getNewCard() {
		//If a bucket is picked gets one from that bucket
		if (singleBucketMode) {
			let filtered = cards.filter((x) => {
				return x.bucket === singleBucket;
			});
			if (filtered.length === 0) {
				setCurrentCard(nullCard);
			} else if (filtered.length === 1) {
				setCurrentCard(filtered[0]);
			} else {
				filtered = filtered.filter((x) => {
					return x.id !== currentCard.id;
				});
				setCurrentCard(
					filtered[Math.floor(Math.random() * filtered.length)]
				);
			}
		} else {
			//Filters out the current card and bucket
			let arr = cards.filter((x) => {
				return x?.id !== currentCard?.id && x?.bucket === currentBucket;
			});
			let i = 0;
			//Runs until there is options for the array to pick from or 100 iterations
			while (arr?.length < 1 && i < 3) {
				//Gets a new bucket
				let newBucket = pickBucket(false);
				//Filters cards
				arr = cards.filter((x) => {
					return x.id !== currentCard?.id && x.bucket === newBucket;
				});
				i++;
			}
			//Sets current card to a random from the available cards
			setCurrentCard(arr[Math.floor(Math.random() * arr?.length)]);
		}
	}

	//picks a new bucket
	//Parameters:
	//notSame (boolean): if true it will not pick the same bucket as the notBucket int
	//notBucket (int): must be inputted if notSame is true
	function pickBucket(notSame, notBucket) {
		let buckets = [0, 0, 0, 0, 0];
		//Increments the index matching the bucket num
		cards.forEach((x) => {
			for (let i = 0; i < buckets.length; i++) {
				if (x.bucket === i + 1) {
					buckets[i] += 1;
				}
			}
		});
		//If a bucket has any cards, it recieves a weight
		let weights = [
			buckets[0] > 0 ? 400 : 0,
			buckets[1] > 0 ? 50 : 0,
			buckets[2] > 0 ? 12 : 0,
			buckets[3] > 0 ? 3 : 0,
			buckets[4] > 0 ? 1 : 0,
		];
		//If not same then the bucket passed is unweighted
		if (notSame) weights[notBucket - 1] = 0;
		let sum = 0;
		//Adds up weights
		for (let i = 0; i < weights.length; i++) {
			sum += weights[i];
		}
		//Gets random num and decides which bucket num
		let random = Math.floor(Math.random() * sum);
		for (let i = 0; i < weights.length; i++) {
			if (random < weights[i]) {
				return i + 1;
			}
			random -= weights[i];
		}
	}

	//When a correct card is picked this is ran
	const handleCorrect = () => {
		var arr = cards;
		//Updates bucket num by +1
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].id === currentCard.id) {
				if (arr[i].bucket < 5) {
					arr[i] = { ...arr[i], bucket: arr[i].bucket + 1 };
				}
			}
		}
		//Gets new card and unflips the card
		setCards(arr);
		setCurrentBucket(pickBucket(false));
		getNewCard();
		setFlipped(!flipped);
		cardRef.current.setFlipped(!flipped);
		//Updates the database with the new info
		if (
			user !== null &&
			user !== undefined &&
			cards !== undefined &&
			cards !== null
		) {
			set(ref(database, "users/" + user.uid + "/" + id), cards);
		}
	};

	//When a card is marked as wrong this is ran
	const handleIncorrect = () => {
		var arr = cards;
		//Updates bucket
		arr.forEach((c, i) => {
			if (c.id === currentCard.id) {
				if (c.bucket > 1) {
					arr[i] = { ...c, bucket: c.bucket - 1 };
				}
			}
		});
		//Gets new card
		setCards(arr);
		setCurrentBucket(pickBucket(false));
		getNewCard();
		setFlipped(!flipped);
		cardRef.current.setFlipped(!flipped);
		//Updates database
		if (
			user !== null &&
			user !== undefined &&
			cards !== undefined &&
			cards !== null
		) {
			set(ref(database, "users/" + user.uid + "/" + id), cards);
		}
	};

	//Deletes progress
	const resetProgress = () => {
		if (user?.displayName !== undefined) {
			remove(ref(database, "users/" + user.uid + "/" + id));
		}
		initial();
	};

	function bucketItem(cardid) {
		return <GoDotFill key={cardid} className="green-dot" />;
	}

	return (
		<div className="flashcard-mode-body">
			<div className="cl-container">
				<div className="current-level">
					Card level: {currentCard?.bucket}
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
					ref={cardRef}
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
							className={
								(singleBucketMode && singleBucket === index + 1
									? "single "
									: "") +
								"bucket-" +
								(index + 1) +
								" bucket "
							}
							onClick={() => {
								setSingleBucketMode(
									singleBucket === index + 1
										? !singleBucketMode
										: true
								);
								setSingleBucket(index + 1);
							}}
						>
							<div className="bucket-title">
								Bucket {index + 1}
							</div>
							<div className="bucket-holder">
								{cards.map((card, i) => {
									return card.bucket === index + 1 ? (
										<div
											className="dot-holder"
											key={card.id + (index + 1)}
										>
											{bucketItem()}
										</div>
									) : (
										<Fragment key={card.id + (index + 1)} />
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
