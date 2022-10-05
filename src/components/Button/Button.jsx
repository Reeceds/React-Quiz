import React from "react";
import "./Button.scss";

export default function Button({ text, click, className }) {
    var btnClass = `cybr-btn ${className}`;

    return (
        <button onClick={click} className={btnClass}>
            {text}
            <span aria-hidden className="cybr-btn__glitch">
                {text}
            </span>
        </button>

        // <button className={className} onClick={click}>
        //     {text}
        // </button>
    );
}
