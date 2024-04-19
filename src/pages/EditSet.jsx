import React from "react";
import "./EditSet.css";
import { uuidv4 } from "@firebase/util";
import { useState, useEffect } from "react";
import { ref, set, onValue, remove, update } from "firebase/database";
import { UserAuth } from "../context/AuthContext";
import { database } from "../firebase-config";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import * as mke from "mathkeyboardengine";
import { TiDelete } from "react-icons/ti";
import ClassesMenu from "../components/ClassesMenu";
import TeachersMenu from "../components/TeachersMenu";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSet() {
	const { user } = UserAuth();
	const [name, setName] = useState("");
	const [cards, setCards] = useState([]);
	const [classes, setClasses] = useState({});
	const [teachers, setTeachers] = useState({});
	const { id } = useParams();
	const navigate = useNavigate();
	//remove after using these
	/* eslint-disable */
	let latexConfiguration = new mke.LatexConfiguration();
	let keyboardMemory = new mke.KeyboardMemory();
	/* eslint-enable */

	useEffect(() => {
		onValue(
			ref(database, id),
			(snapshot) => {
				setCards(snapshot.val().cards);
			},
			{
				onlyOnce: true,
			}
		);
		onValue(
			ref(database, "flashcard-sets/" + id),
			(snapshot) => {
				setClasses(arrToObject(snapshot.val().Classes));
				setTeachers(arrToObject(snapshot.val().Teachers));
				setName(snapshot.val().Name);
			},
			{
				onlyOnce: true,
			}
		);
		//eslint-disable-next-line
	}, []);

	function arrToObject(arr) {
		let newEl = {};
		arr.forEach((teacher) => {
			newEl = { ...newEl, [teacher]: true };
		});
		return newEl;
	}

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

	const deleteSet = () => {
		onValue(
			ref(database, "users/" + user.uid),
			(snapshot) => {
				update(ref(database, "users/" + user.uid), {
					madeSets: snapshot
						.child("madeSets")
						.val()
						.filter((item) => item !== id),
				});
			},
			{
				onlyOnce: true,
			}
		);
		remove(ref(database, "flashcard-sets/" + id));
		remove(ref(database, id));
		navigate("/Home");
	};

	function checkValid() {
		let str = "Please fix your set:\n";
		str += name.length > 0 ? "" : "Must have a name\n";
		str += cards.length > 1 ? "" : "Must have at least 2 cards\n";
		str += Object.values(classes).includes(true)
			? ""
			: "Must have at least one class selected\n";
		str += Object.values(teachers).includes(true)
			? ""
			: "Must have at least one teacher selected\n";
		str +=
			Object.values(teachers).filter((item) => item).length > 5
				? "Cannot have more than 5 teachers selected\n"
				: "";
		str +=
			Object.values(classes).filter((item) => item).length > 5
				? "Cannot have more than 5 classes selected\n"
				: "";
		if (str.length > 22) alert(str);
		return (
			cards.length > 1 &&
			Object.values(classes).includes(true) &&
			Object.values(teachers).includes(true) &&
			Object.values(classes).filter((item) => item).length > !5 &&
			Object.values(teachers).filter((item) => item).length > !5 &&
			name.length > 0
		);
	}

	function writeSet() {
		if (checkValid()) {
			set(ref(database, id), {
				cards,
			});
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
			set(ref(database, "flashcard-sets/" + id), {
				AuthorID: user.uid,
				Author: user.displayName,
				Name: name,
				Classes: trueClasses,
				Teachers: trueTeachers,
			});
			alert("Set Updated!");
		}
	}

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
				{/*frontBack === "back" ? (
          
        ) : (
          <></>
        )*/}
			</>
		);
	}

	function genCardBox(card, frontBack, id) {
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
			return (
				<>
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

	const deleteCard = (id) => {
		setCards((old) => {
			return old.filter((card) => id !== card.id);
		});
	};

	return (
		<>
			<div className="create-set-container">
				<button className="deleteset-button" onClick={deleteSet}>
					Delete Set
				</button>
				<div className="name-set-container">
					<textarea
						maxLength="72"
						type="text"
						placeholder="Name set"
						id="name-set"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
						}}
					/>
				</div>
				<div className="all-cards">
					{cards?.map((card, i) => {
						return (
							<div className="card-container-cs" key={card.id}>
								<div className="input-box-container">
									{genCardBox(card, "front", i)}
								</div>
								<div className="input-box-container">
									{genCardBox(card, "back", i)}
									<TiDelete
										size="20"
										className="delete-button"
										onClick={() => deleteCard(card.id)}
									></TiDelete>{" "}
								</div>
							</div>
						);
					})}
				</div>
				<button className="add-card-button" onClick={createCard}>
					Add card
				</button>
				{cards.length !== 0 ? (
					<button
						className="create-set-button"
						onClick={() => writeSet()}
					>
						Update Set
					</button>
				) : (
					<div className="add-card-message create-set-button">
						Please add a card
					</div>
				)}
				<div className="create-set-extras">
					<ClassesMenu
						classes={classes}
						classSelect={(classes) => setClasses(classes)}
					/>
					<TeachersMenu
						teachers={teachers}
						teacherSelect={(teachers) => setTeachers(teachers)}
					/>
				</div>
			</div>
		</>
	);
}
