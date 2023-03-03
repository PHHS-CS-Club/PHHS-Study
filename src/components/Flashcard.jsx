import React, {useState} from 'react';
import './Flashcard.css'

//https://www.youtube.com/watch?v=hEtZ040fsD8&t=193s

export default function Flashcard( flashcard ) {
    const [flip, setFlip] = useState(false);

    return (
        <div 
        className={'card'  + (flip ? 'flip' : '')}
        onClick={() => {setFlip(!flip)}}>
            <div className="front">
                {flashcard.question}
            </div>
            <div className="back">
                {flashcard.answer}
            </div>
        </div>
    )
}