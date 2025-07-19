const Square = ({ rows, columns, color, value, revealed, flagged, position, handleClick }) => {
  let newText = "";
  if (revealed) {
    if (value === 0) {
      newText = "\u00A0";
    } else {
      newText = value;
    }
  } else {
    newText = "\u00A0";
  }
  return (
    <div className="sq">
      <h1 style={{
        width: 540/columns,
        height: 480/rows,
        backgroundColor: color,
        fontSize: 480/rows/1.15,
        whiteSpace: "nowrap",
        margin: "0"
      }}
      onMouseDown={(e) => handleClick(e, position)}
      onContextMenu={(e) => e.preventDefault()}>
      
      {
        flagged && <img src="flag.png" alt="Flag" style={{
        width: 540/columns,
        height: 480/rows,
        margin: 0,
        padding: 0,
        objectFit: "contain"
      }}/>
      }
      {
        !flagged && newText
      }
      </h1>
    </div>
  );
}
 
export default Square;