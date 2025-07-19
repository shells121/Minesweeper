import React, { useState } from "react";

const Header = ({ difficulty, flags, handleDiffChange }) => {
  return (
    <div className="header">
      <h1>Minesweeper!</h1>
      <div className="bar">
        <div className="dropdown">
          <p>{difficulty} &#9660;</p>
          <div className="dropdown-content">
            <p onClick={handleDiffChange}>Easy</p>
            <p onClick={handleDiffChange}>Medium</p>
            <p onClick={handleDiffChange}>Hard</p>
          </div>
        </div>
        <div className="empty"></div>
        <img src="flag.png" alt="Flag" />
        <h2>{ flags }</h2>
      </div>
    </div>
  );
}
 
export default Header;