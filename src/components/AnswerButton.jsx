import React from 'react'

export default function AnswerButton({ answer, checkAnswer, className }) {
    return (
        <button className={className} onClick={checkAnswer}>{answer}</button>
    )
}
