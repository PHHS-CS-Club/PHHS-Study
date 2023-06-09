import React from "react";
import "./Home.css";

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
            prepare, practice, and study for their classes.
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
        <div className="contributers-image">image</div>
      </div>
    </>
  );
}
