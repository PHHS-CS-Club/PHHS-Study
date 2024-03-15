import React from "react";
import { uuidv4 } from "@firebase/util";
import { ref, set, onValue, update } from "firebase/database";
import { Link, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./ViewSet.css";
import FlashcardMode from "../components/FlashcardMode";

export default function ViewSet() {
	const { user } = UserAuth();
	const [cards, setCards] = useState([]);
	const [mode, setMode] = useState("view");
	const [metadata, setMetadata] = useState({});
	const [userdata, setUserdata] = useState("");
	//Gets the id from the set
	const { id } = useParams();
	//Gets the flashcard data to display
	const uRef = ref(database, "/users/" + user.uid);
	const navigate = useNavigate();
	useEffect(() => {
		//gets the cards
		onValue(
			ref(database, id),
			(snapshot) => {
				const data = snapshot.val();
				if (data !== null) {
					setCards(data.cards);
				}
			},
			{
				onlyOnce: true,
			}
		);

		//Gets the metaData
		onValue(
			ref(database, "flashcard-sets/" + id),
			(snapshot) => {
				const metaData = snapshot.val();
				setMetadata(metaData);
			},
			{
				onlyOnce: true,
			}
		);
	}, [id]);

	useEffect(() => {
		onValue(
			uRef,
			(snapshot) => {
				const data = snapshot.val();
				setUserdata(data);
			},
			{ onlyOnce: true }
		);
	}, [uRef]);

	function copySet() {
		//Generated new id
		let newId = uuidv4();
		//Sets the card data
		set(ref(database, newId), { cards });
		let newData = metadata;
		newData.AuthorID = user.uid;
		newData.Author = userdata.username;
		// sets the metaData for the deck
		set(ref(database, "flashcard-sets/" + newId), newData);
		console.log(newData);
		console.log(newId);
		//Updates madeSets
		if (userdata.madeSets?.length > 0) {
			update(ref(database, "users/" + user.uid), {
				madeSets: [...userdata.madeSets, newId],
			});
		} else {
			set(ref(database, "users/" + user.uid), {
				...userdata,
				madeSets: [newId],
			});
		}
		//Resets page data and navigates to where the set was created.
		console.log("navigating to set");
		navigate("/Edit/" + newId);
	}

	//Based on the current mode, it will display different modes located in the components
	//View mode is the default mode set when opening the page
	if (mode === "view") {
		return (
			<div>
				<div className="flashcard-metadata">
					<div className="viewset-title">
						{/**Title */}
						{metadata ? metadata.Name : "Set does not exist"}
						{/**If user owns the set creates an edit button */}
						{user?.uid === metadata?.AuthorID ? (
							<Link to={"/Edit/" + id}>
								<button className="vsedit-button">
									Edit Set
								</button>
							</Link>
						) : (
							<></>
						)}
						{metadata ? (
							<div>
								<button
									className="vsedit-button"
									onClick={() => copySet()}
								>
									Copy
								</button>
							</div>
						) : (
							<></>
						)}
					</div>
					{/**Author */}
					<div key={"author"} className="viewset-author">
						Created By {metadata ? metadata.Author : "N/A"}
					</div>
					{/**Classes */}
					<div key={"classes"} className="viewset-classes">
						<div className="viewset-infopart">Classes: </div>
						{metadata ? (
							metadata.Classes?.map((clas, i) => {
								return (
									<div key={clas} className="item-viewset">
										{clas}
									</div>
								);
							})
						) : (
							<></>
						)}
					</div>
					{/**Teachers */}
					<div key={"teachers"} className="viewset-teachers">
						<div className="viewset-infopart">Teachers: </div>
						{metadata ? (
							metadata.Teachers?.map((clas, i) => {
								return (
									<div key={clas} className="item-viewset">
										{clas}
									</div>
								);
							})
						) : (
							<></>
						)}
					</div>
				</div>
				{metadata ? (
					<div className="viewset-button-wrapper">
						{/**Sets mode to flashcard */}
						<button
							className="viewset-buttons"
							onClick={() => {
								setMode("Flashcard");
							}}
						>
							Flashcard mode
						</button>
					</div>
				) : (
					<></>
				)}
				{/**Displays all the cards */}
				{metadata ? (
					<div className="viewset-card-title">Cards</div>
				) : (
					<></>
				)}
				<div className="cards-viewer">
					{cards?.map((card) => {
						return (
							<div key={card.id} className="card-container">
								{card.mathModeFront ? (
									<div className="view-front">
										<InlineMath>{card.front}</InlineMath>
									</div>
								) : (
									<div className="view-front">
										{card.front}
									</div>
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
			</div>
		);
		//If mode is set to Flashcard, renders the FlashcardMode component on the page
	} else if (mode === "Flashcard") {
		return (
			<div className="flashcard-mode-container">
				<button
					className="exit-fsmode-button"
					onClick={() => {
						setMode("view");
					}}
				>
					Exit Flashcard Mode
				</button>
				<FlashcardMode cards={cards} />
			</div>
		);
	}
}
