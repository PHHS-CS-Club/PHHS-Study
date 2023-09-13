import React from "react";
import "./Home.css";
import clubPhoto from "../images/ClubPhoto.jpg";
import clubLogo from "../images/ClubLogo.png";

export default function Home() {
  return (
    //Flashcard select stuff should go in here
    //Search functionality aswell
    //Any other related features
    <>
      <div className="home-starter-container">
        <div className="home-starter">
          Welcome to the Patrick Henry High School Flashcard and Study Website!
        </div>
      </div>
      <div className="website-goal-div">
        <div className="website-goal-container-image">
          <img className="website-goal-image" src={clubLogo} alt="ClubLogo" />
        </div>
        <div className="website-goal-writing">
          <div className="website-goal-title">What We Are About</div>
          <div className="website-paragraph">
            We are the computer science club of Patrick Henry High School. We
            have developed this website to support the students of Patrick Henry
            and help them prepare, practice, and study for their classes. We
            offer the ability to create, edit, and share flashcards. To find a
            flashcard set, go to the "Search" page. To make a flashcard set, go
            to the "Create Set" page. To change your username, role, log out, or
            view your flashcard sets, go to the "Account" page.
          </div>
        </div>
      </div>
      <div className="contributors-div">
        <div className="contributors-writing">
          <div className="contributors-title">Contributors</div>
          <div className="contributors-names">
            President: Ryan Virtue
            <br />
            Vice President: Kyle Vo
            <br />
            Treasurer: Drew Miller
            <br />
            Secretary: Charlie Havens
            <br />
            Developer: Oliver Cushman
            <br />
            Developer: Lukas Halvorsen
            <br />
            Mascot: Colin Miller
          </div>
        </div>
        <div className="contributors-container-image">
          <img className="contributors-image" src={clubPhoto} alt="ClubPhoto" />
        </div>
      </div>
    </>
  );
}
