import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        style={this.props.styles[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(r) {
    var row = [];
    for (let i = 0; i < 3; i++) {
      row = row.concat(this.renderSquare(i+3*r));
    }
    return (<div className="board-row">{row}</div>);
  }

  render() {
    var board = [];
    for (let i = 0; i < 3; i++) {
      board = board.concat(this.renderRow(i));
    }
    return (<div>{board}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          styles: Array(9).fill({color:'black'}),
          lastMove: Number(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const styles = current.styles.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    const winners = winningSquares(squares);
    if (winners) {
      for (let s of winners) {
        styles[s] = {color:'red'};
      }
    }

    this.setState({
      history: history.concat([
        {
          squares: squares,
          styles: styles,
          lastMove: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
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

    var moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " (" + step.lastMove%3 + ", " + Math.floor(step.lastMove/3) + ") ":
        'Go to game start';

      const style = (this.state.stepNumber === move) ? {fontWeight:'bold'} : {fontWeight:'normal'};

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={style}>{desc}</button>
        </li>
      );
    });

    if (!this.state.sortAscending) moves = moves.reverse();

    var status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber == 9) { status = "Draw Game";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            styles={current.styles}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({sortAscending: !this.state.sortAscending})}>
            Sort history: {this.state.sortAscending ? "Ascending" : "Descending"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function winningSquares(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}