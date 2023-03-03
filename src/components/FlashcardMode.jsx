import React from 'react';
import {useState, useEffect} from 'react';
import Flashcard from './Flashcard';

export default function FlashcardMode(props) {
    const[cards, setCards] = useState([]);
    const[bucketOne, setBucketOne] = useState([]);
    const[bucketTwo, setBucketTwo] = useState([]);
    const[bucketThree, setBucketThree] = useState([]);
    const[bucketFour, setBucketFour] = useState([]);
    const[bucketFive, setBucketFive] = useState([]);
    
    useEffect(() => {
        setBucketOne(props.cards);
        setCards(props.cards);
    }, []);
    return (<div className="card-container-fsm">
        <Flashcard question={"test quest"} answer={"test ans"}/>
    </div>);
}