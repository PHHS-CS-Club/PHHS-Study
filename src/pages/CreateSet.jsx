import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase-config";

export default function CreateSet() {
	const [name, setName] = useState("");
	const [cards, setCards] = useState([]);

	const createCard = () => {
		return (
			<div>
				<input type="text"></input>
				<button>Delete card</button>
			</div>
		);
	};

	return (
		<>
			<div>
				<input
					type="text"
					onChange={(event) => {
						setName(event);
					}}
				/>
				<button onClick={createCard}>Add card</button>
			</div>
		</>
	);
}
