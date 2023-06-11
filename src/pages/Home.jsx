import React from "react";
import "./Home.css";
import clubPhoto from "../images/ClubPhoto.jpg";

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
        <div className="website-goal-image">image</div>
        <div className="website-goal-writing">
          <div className="website-goal-title">
            What Is The Purpose Of This Website?
          </div>
          <div className="website-paragraph">
            Our goal is to support the students of Patrick Henry and help them
            prepare, practice, and study for their classes. We offer the ability
            to create, edit, and share flashcards. To find a flashcard set, go
            to the "Search" page. To make a flashcard set, go to the "Creat Set"
            page. To change your username, role, log out, or view your flashcard
            sets, go to the "Account" page.
          </div>
        </div>
      </div>
      <div className="contributers-div">
        <div className="contributers-writing">
          <div className="contributers-title">Contributers</div>
          <div className="contributers-names">
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
        <div className="contributers-container-image">
          <img className="contributers-image" src={clubPhoto} alt="ClubPhoto" />
        </div>
      </div>
    </>
  );
}
