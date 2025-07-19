import BoardRow from "./BoardRow.js";
import {v4 as uuidv4 } from "uuid";

const Board = ({ bSize, bContent, bRevealed, bFlags, handleClick }) => {
  const board = [];
  for (let i = 0; i < bContent.length; i++) {
    board.push(<BoardRow
      even={i % 2}
      bSize={bSize}
      bRow={bContent[i]}
      bRevealed={bRevealed[i]}
      bFlags={bFlags[i]}
      handleClick={handleClick}
      rowId={i}
      key={uuidv4()}
    />);
  }

  return (
    <div className="board">
      { board }
    </div>
  );
}
 
export default Board;