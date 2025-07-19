import Square from "./Square.js";
import {v4 as uuidv4 } from "uuid";

const BoardRow = ({ even, bSize, bRow, bRevealed, bFlags, rowId, handleClick }) => {
  const row = [];
  for (let i = 0; i < bRow.length; i++) {
    let color = "";
    if (bRevealed[i]) {
      if (i % 2 === even) {
        color = "#E5C29F";
      } else {
        color = "#D7B899";
      }
    } else {
      if (i % 2 === even) {
        color = "#AAD751";
      } else {
        color = "#A2D148";
      }
    }
    
    row.push(<Square
      rows={bSize[0]}
      columns={bSize[1]}
      color={color}
      value={bRow[i]}
      revealed={bRevealed[i]}
      flagged={bFlags[i]}
      position={[rowId, i]}
      handleClick={handleClick}
      key={uuidv4()}
    />);
  }
  // use &#x200B; for empty spaces

  return (
    <div className="board-row">
      {row}
    </div>
  );
}
 
export default BoardRow;