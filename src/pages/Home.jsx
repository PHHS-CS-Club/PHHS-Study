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
				We are the premier studying tool made both by and for students
				at Patrick Henry High School. All developers are high schoolers
				from the school who are apart of the{" "}
				<a
					className="complaint-link"
					href="https://sites.google.com/mrjaffesclass.com/csclub"
				>
					computer science club!
				</a>
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
					<div className="contributors-title">Contributors:</div>
					<div className="contributors-names">
						Ryan Virtue
						<br />
						Oliver Cushman
						<br />
						Drew Miller
						<br />
						Charlie Havens
					</div>
				</div>
				<div className="contributors-container-image"></div>
			</div>
		</div>
	);
}
