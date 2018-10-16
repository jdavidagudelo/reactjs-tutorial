import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function getSquareClass(selected, currentIndex, line) {
    let currentClass = selected === currentIndex? "square-bold": 'square';
    if (line != null) {
      let currentLine = lines[line];
      return currentLine.includes(currentIndex)? 'square-red': currentClass;
    }
    return currentClass;
}

function Square(props) {
  return (
    <button className={getSquareClass(props.selected, props.currentIndex, props.line)} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        selected={this.props.selected}
        line={this.props.line}
        currentIndex={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(r) {
     let data = [];
     for(let i = 0; i < 3; i++){
        data.push(this.renderSquare(3 * r + i));
     }
     return data;
  }

  renderBoard() {
    let data = [];
    for(let i = 0; i < 3; i++){
        data.push(
        <div className="board-row"> {this.renderRow(i)} </div>
        );
    }
    return data;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(squares[i]) {
        return;
    }
    if(current.isOver){
        return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    let evaluate = calculateWinner(squares);
    if (evaluate !== null && !this.state.isOver) {
      if (evaluate.result) {
        current.line = evaluate.line;
        current.squares = squares;
        current.isOver = true;
        history[history.length - 1] = current;
        this.setState({
            history: history,
            stepNumber: this.state.stepNumber,
            xIsNext: !this.state.xIsNext,
            selected: i
        });
        return;
      }
      if (evaluate.result){
        return;
      }
    }
    this.setState({
      history: history.concat([
        {
          squares: squares,
          selected: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const selected = current.selected;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            selected={selected}
            line={current.line}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {result: squares[a], line: i};
    }
  }
  return null;
}
