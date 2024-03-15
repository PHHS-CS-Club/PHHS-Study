import { uuidv4 } from "@firebase/util";
import React from "react";
import { useState, useEffect } from "react";
import { ref, set, onValue, update } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import { InlineMath } from "react-katex";
import { useNavigate } from "react-router-dom";
import "katex/dist/katex.min.css";
import * as mke from "mathkeyboardengine";
import { TiDelete } from "react-icons/ti";
import "./CreateSet.css";
import ClassesMenu from "../components/ClassesMenu";
import TeachersMenu from "../components/TeachersMenu";

//Page for creating sets
export default function CreateSet() {
	const { user } = UserAuth();
	const [name, setName] = useState("");
	const [cards, setCards] = useState([]);
	const [classes, setClasses] = useState({});
	const [teachers, setTeachers] = useState({});
	const [userData, setUserData] = useState([]);
	const [authorName, setAuthorName] = useState("");
	const navigate = useNavigate();
	var Filter = require("bad-words"),
		filter = new Filter();
	filter.removeWords("balls", "ball");

	//remove after using these
	/* eslint-disable */
	let latexConfiguration = new mke.LatexConfiguration();
	let keyboardMemory = new mke.KeyboardMemory();
	/* eslint-enable */
	const dbRef = ref(database, "/users/" + user.uid);

	//Gets user information and stores them
	useEffect(() => {
		onValue(
			dbRef,
			(snapshot) => {
				const data = snapshot.val();
				setUserData(data);
				setAuthorName(snapshot.child("username").val());
			},
			{
				onlyOnce: true,
			}
		);
		//eslint-disable-next-line
	}, []);

	//Adds a new card to the cards list defaulted to a new card id, empty front/back, and math mode off
	const createCard = () => {
		const list = cards.concat({
			id: uuidv4(),
			front: "",
			back: "",
			mathModeFront: false,
			mathModeBack: false,
		});
		setCards(list);
	};

	//Parses together cards marked with profanity to add to the error message
	function arraystring(array) {
		let str = "";
		array.forEach((item) => {
			str +=
				(filter.isProfane(item.front) ? item.front : "") +
				", " +
				(filter.isProfane(item.back) ? item.back : "") +
				"\n";
		});
		return str;
	}

	//Checks whether a set is valid to be submitted
	//A set is ok to be submitted if; Between 1 and 5 classes/teachers inclusive, more than 1 card, there are no empty cards, and there is no profanity detected
	function checkValid() {
		//Default phrase
		let str = "Please fix your set:\n";
		//Checks if there is a name and more than 1 card
		str += name.length > 0 ? "" : "Must have a name\n";
		str += cards.length > 1 ? "" : "Must have at least 2 cards\n";
		//Checks if there is a selected class/teacher
		str += Object.values(classes).includes(true)
			? ""
			: "Must have at least one class selected\n";
		str += Object.values(teachers).includes(true)
			? ""
			: "Must have at least one teacher selected\n";
		//Checks if there is more than 5 classes/teachers
		str +=
			Object.values(teachers).filter((item) => item).length > 5
				? "Cannot have more than 5 teachers selected\n"
				: "";
		str +=
			Object.values(classes).filter((item) => item).length > 5
				? "Cannot have more than 5 classes selected\n"
				: "";
		//Checks if every card is filled out
		str +=
			cards.filter((card) => card.front === "" || card.back === "")
				.length === 0
				? ""
				: "Please fill out every card\n";
		//Checks if there is any profanity
		str +=
			!(
				cards.filter(
					(card) =>
						filter.isProfane(card.front) ||
						filter.isProfane(card.back)
				).length !== 0
			) && !filter.isProfane(name)
				? ""
				: "no bad words allowed\ncards containing bad words:" +
				  arraystring(
						cards.filter(
							(card) =>
								filter.isProfane(card.front) ||
								filter.isProfane(card.back)
						)
				  );
		//If anything wrong with the card was wrong, the message string would be longer than the default message length so it only alerts if this is true
		if (str.length > 22) alert(str);
		//Returns the boolean expression
		return (
			cards.length > 1 &&
			Object.values(classes).includes(true) &&
			Object.values(teachers).includes(true) &&
			Object.values(classes).filter((item) => item).length > !5 &&
			Object.values(teachers).filter((item) => item).length > !5 &&
			cards.filter((card) => card.front === "" || card.back === "")
				.length === 0 &&
			name.length > 0 &&
			!(
				cards.filter(
					(card) =>
						filter.isProfane(card.front) ||
						filter.isProfane(card.back)
				).length !== 0
			) &&
			!filter.isProfane(name)
		);
	}

	//Writes set to the database if the deck is valid
	function writeSet() {
		if (checkValid()) {
			//Generated new id
			let newId = uuidv4();
			//Sets the card data
			set(ref(database, newId), {
				cards,
			});
			//Puts the classes/teachers into an array
			let trueClasses = [];
			Object.keys(classes).forEach((x) => {
				if (classes[x] === true) {
					trueClasses.push(x);
				}
			});
			let trueTeachers = [];
			Object.keys(teachers).forEach((x) => {
				if (teachers[x] === true) {
					trueTeachers.push(x);
				}
			});
			//sets the metaData for the deck
			set(ref(database, "flashcard-sets/" + newId), {
				AuthorID: user.uid,
				Author: authorName,
				Name: name,
				Classes: trueClasses,
				Teachers: trueTeachers,
			});
			//Updates madeSets
			if (userData.madeSets?.length > 0) {
				update(ref(database, "users/" + user.uid), {
					madeSets: [...userData.madeSets, newId],
				});
			} else {
				set(ref(database, "users/" + user.uid), {
					...userData,
					madeSets: [newId],
				});
			}
			//Resets page data and navigates to where the set was created.
			setCards([]);
			setName("");
			console.log("navigating to set");
			navigate("/Set/" + newId);
		}
	}
	//Updates the front of a card given the new text and card id
	function updateFront(text, id) {
		const list = cards.map((card) => {
			if (card.id === id) {
				return {
					id: card.id,
					front: text,
					back: card.back,
					mathModeFront: card.mathModeFront,
					mathModeBack: card.mathModeBack,
				};
			}
			return card;
		});
		setCards(list);
	}
	//Updates the back of a card given the new text and card id
	function updateFrontMath(id, mathMode) {
		const list = cards.map((card) => {
			if (card.id === id) {
				return {
					id: card.id,
					front: card.front,
					back: card.back,
					mathModeFront: mathMode,
					mathModeBack: card.mathModeBack,
				};
			}
			return card;
		});
		setCards(list);
	}
	//Updates the back math mode given the id and true/false
	function updateBackMath(id, mathMode) {
		const list = cards.map((card) => {
			if (card.id === id) {
				return {
					id: card.id,
					front: card.front,
					back: card.back,
					mathModeBack: mathMode,
					mathModeFront: card.mathModeFront,
				};
			}
			return card;
		});
		setCards(list);
	}

	//Updates the front math mode given the id and true/false
	function updateBack(text, id) {
		const list = cards.map((card) => {
			if (card.id === id) {
				return {
					id: card.id,
					front: card.front,
					back: text,
					mathModeFront: card.mathModeFront,
					mathModeBack: card.mathModeBack,
				};
			}
			return card;
		});
		setCards(list);
	}

	//Generates the math mode checkbox with label
	function mathModeButtons(card, frontBack, id) {
		return (
			<>
				<input
					id={frontBack + id}
					className="math-checkbox"
					checked={
						(frontBack === "front" && card?.mathModeFront) ||
						(frontBack === "back" && card?.mathModeBack)
					}
					type="checkbox"
					name={frontBack + id}
					onChange={(event) => {
						if (frontBack === "front") {
							updateFrontMath(card.id, event.target.checked);
						} else if (frontBack === "back") {
							updateBackMath(card.id, event.target.checked);
						}
					}}
				/>
				<label className="math-check-label-cs" htmlFor={frontBack + id}>
					Math Mode
				</label>
			</>
		);
	}

	//Generates the card box along with the parameters of the card data, a str telling if its front or back, and the id
	function genCardBox(card, frontBack, id) {
		//If math mode is true it will render it with katex
		if (frontBack === "front" && card.mathModeFront === true) {
			return (
				<>
					<div style={{ overflow: "auto", height: "100%" }}>
						<InlineMath
							className="katex-display"
							math={card.front}
							maxExpand="5"
						></InlineMath>
					</div>
					{mathModeButtons(card, frontBack, id)}
				</>
			);
		} else if (frontBack === "back" && card.mathModeBack === true) {
			return (
				<div style={{ overflow: "auto", height: "100%" }}>
					<InlineMath style={{ position: "relative" }}>
						{card.back}
					</InlineMath>
					{mathModeButtons(card, frontBack, id)}
				</div>
			);
		} else {
			//Returns textarea containing the value for the card and updates it on change
			return (
				<>
					{/** */}
					<textarea
						maxLength="360"
						type="text"
						placeholder={
							frontBack.charAt(0).toUpperCase() +
							frontBack.slice(1)
						}
						className={frontBack + "-side"}
						id={frontBack}
						value={frontBack === "front" ? card.front : card.back}
						onChange={(event) => {
							if (frontBack === "front") {
								updateFront(event.target.value, card.id);
							} else if (frontBack === "back") {
								updateBack(event.target.value, card.id);
							}
						}}
					/>

					{mathModeButtons(card, frontBack, id)}
				</>
			);
		}
	}

	//Deletes a card from cards array
	const deleteCard = (id) => {
		setCards((old) => {
			return old.filter((card) => id !== card.id);
		});
	};

	return (
		<>
			{/**Name text area */}
			<div className="create-set-container">
				<textarea
					maxLength="72"
					type="text"
					placeholder="Name set"
					id="name-set"
					onChange={(event) => {
						setName(event.target.value);
					}}
				/>
				<br />
				{/**Generates card div for each card containing the two card boxes */}
				{cards.map((card, i) => {
					return (
						<div className="card-container-cs" key={card.id}>
							<TiDelete
								size="20"
								className="delete-button"
								onClick={() => deleteCard(card.id)}
							></TiDelete>{" "}
							<div className="input-box-container">
								{genCardBox(card, "front", i)}
							</div>
							<div className="input-box-container">
								{genCardBox(card, "back", i)}
							</div>
						</div>
					);
				})}
				<br />
				<button className="add-card-button" onClick={createCard}>
					Add card
				</button>
				{cards.length !== 0 ? (
					<button
						className="create-set-button"
						onClick={() => writeSet()}
					>
						Create Set
					</button>
				) : (
					<div className="add-card-message">Please add a card</div>
				)}
				<div className="create-set-extras">
					<ClassesMenu
						classSelect={(classes) => setClasses(classes)}
					/>
					<TeachersMenu
						teacherSelect={(teachers) => setTeachers(teachers)}
					/>
				</div>
			</div>
		</>
	);
}
