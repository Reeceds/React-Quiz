import React from "react";
import "./AnswerButton.scss";

export default function AnswerButton({ answer, checkAnswer, className }) {
    var btnClass = `button quiz-answer-btn ${className}`;

    return (
        <div className={btnClass} onClick={checkAnswer}>
            <div className="bottom"></div>

            <div className="top">
                <div className="label">{answer}</div>

                <div className="button-border button-border-left"></div>
                <div className="button-border button-border-top"></div>
                <div className="button-border button-border-right"></div>
                <div className="button-border button-border-bottom"></div>
            </div>
        </div>
    );
}
