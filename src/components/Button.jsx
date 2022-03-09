import React from 'react'

export default function Button({ text, click, className }) {
  return (
    <button className={className} onClick={click}>{text}</button>
  )
}
