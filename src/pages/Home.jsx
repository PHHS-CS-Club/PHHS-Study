import React from "react";
import "./Home.css";

export default function Home() {
	return (
		//Flashcard select stuff should go in here
		//Search functionality aswell
		//Any other related features
		<div className="home-page">
			<div className="home-starter-container">
				<div className="home-starter">
					Welcome to the Patrick Henry High School Flashcard and Study
					Website!
				</div>
			</div>
			<br />
			<div className="what-we-are">
				We are the premier studying tool specifically made for students
				at Patrick Henry High School with specialized study sets made by
				students for students. All developers are high schoolers from
				the school apart of the computer science club!
			</div>
			<br />
			<div className="how-to-use">
				Go to create set to make flashcards, the search page to find and
				use flashcards, and sign in to save your progress!
			</div>
			<br />
			<div className="complaints">
				If you have any complaints, please let us know{" "}
				<a
					className="complaint-link"
					rel="noreferrer"
					target="_blank"
					href="https://forms.gle/73ziV7PvK1isb9XS9"
				>
					here
				</a>
			</div>

			<div className="contributors-div">
				<div className="contributors-writing">
					<div className="contributors-title">Contributors</div>
					<div className="contributors-names">
						President: Ryan Virtue
						<br />
						Vice President: Oliver Cushman
						<br />
						Goat: Drew Miller
					</div>
				</div>
				<div className="contributors-container-image"></div>
			</div>
		</div>
	);
}
