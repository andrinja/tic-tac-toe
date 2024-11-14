import {useState} from 'react';

function App() {
	const [gameBoard, setGameBoard] = useState([
		Array(3).fill(null),
		Array(3).fill(null),
		Array(3).fill(null),
	]);

	const [turn, setTurn] = useState<'X' | 'O'>('X');
	const [isGameOver, setIsGameOver] = useState(false);
	const [outcome, setOutcome] = useState<'X' | 'O' | 'draw' | undefined>();
	const [score, setScore] = useState<Record<'X' | 'O' | 'draw', number>>({
		X: 0,
		O: 0,
		draw: 0,
	});
	const [showGame, setShowGame] = useState(false);

	const handleClick = (rowIndex: number, colIndex: number) => {
		if (isGameOver || gameBoard[rowIndex][colIndex]) {
			return;
		}

		// Set the value of the cell to the current turn
		const newGameBoard = gameBoard.map((row, rIndex) => {
			if (rIndex === rowIndex) {
				return row.map((cell, cIndex) => {
					if (cIndex === colIndex) {
						return turn;
					}
					return cell;
				});
			}
			return row;
		});

		setGameBoard(newGameBoard);

		// Function to check for a winner
		const checkWinner = (board: ('X' | 'O' | undefined)[][]): 'X' | 'O' | undefined => {
			const lines = [
				// Horizontal lines
				[board[0][0], board[0][1], board[0][2]],
				[board[1][0], board[1][1], board[1][2]],
				[board[2][0], board[2][1], board[2][2]],
				// Vertical lines
				[board[0][0], board[1][0], board[2][0]],
				[board[0][1], board[1][1], board[2][1]],
				[board[0][2], board[1][2], board[2][2]],
				// Diagonal lines
				[board[0][0], board[1][1], board[2][2]],
				[board[0][2], board[1][1], board[2][0]],
			];

			// Check each line for a winning condition
			for (let line of lines) {
				const [a, b, c] = line;
				if (a && a === b && a === c) {
					return a;
				}
			}

			return;
		};

		const winningPlayer = checkWinner(newGameBoard);
		console.log(winningPlayer);
		if (winningPlayer) {
			setIsGameOver(true);
			setOutcome(winningPlayer);
			setScore((prevScore) => ({
				...prevScore,
				[winningPlayer]: prevScore[winningPlayer] + 1,
			}));
		} else {
			const isBoardFull = newGameBoard.every((row) => row.every((cell) => cell));
			if (isBoardFull) {
				setIsGameOver(true);
				setOutcome('draw');
				setScore((prevScore) => ({
					...prevScore,
					draw: prevScore.draw + 1,
				}));
			} else {
				// Flip the turn to the other player
				setTurn((prevTurn) => (prevTurn === 'X' ? 'O' : 'X'));
			}
		}
	};

	const resetGame = () => {
		setGameBoard([Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)]);
		setTurn('X');
		setIsGameOver(false);
		setOutcome(undefined);
	};

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			{!showGame && (
				<div className='flex flex-col gap-4'>
					<h1>Tic tac toe</h1>
					<button
						onClick={() => setShowGame(true)}
						className='bg-white hover:bg-gray-100 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded'
					>
						Play vs human
					</button>
					<button
						disabled
						className={`bg-white font-semibold py-2 px-4 border border-gray-400 rounded shadow ${
							true ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
						}`}
					>
						Play vs AI
					</button>
				</div>
			)}
			{showGame && (
				<div>
					<div className='min-h-72 flex flex-col items-center'>
						{gameBoard.map((_, rowIndex) => (
							<div key={rowIndex} style={{display: 'flex'}}>
								{[0, 1, 2].map((colIndex) => (
									<button
										key={colIndex}
										style={{
											height: '60px',
											width: '60px',
											fontSize: '24px',
											color:
												gameBoard[rowIndex][colIndex] === 'X'
													? 'blue'
													: gameBoard[rowIndex][colIndex] === 'O'
													? 'yellow'
													: 'red',
											fontWeight: 'bold',
											border: '1px solid gray', // Add a thin border
											borderRight: colIndex === 2 ? 'none' : '1px solid gray', // Remove right border for the last column
											borderBottom: rowIndex === 2 ? 'none' : '1px solid gray', // Remove bottom border for the last row
											borderLeft: colIndex === 0 ? 'none' : '1px solid gray', // Remove left border for the first column
											borderTop: rowIndex === 0 ? 'none' : '1px solid gray', // Remove top border for the first row
											background: 'black',
										}}
										onClick={() => handleClick(rowIndex, colIndex)}
										disabled={isGameOver || gameBoard[rowIndex][colIndex]}
									>
										{gameBoard[rowIndex][colIndex] || ' '}
									</button>
								))}
							</div>
						))}
						<div className='mt-4'>
							<table className='table-auto'>
								<thead>
									<tr>
										<th className='px-4 py-2'>X</th>
										<th className='px-4 py-2'>Draw</th>
										<th className='px-4 py-2'>O</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='border px-4 py-2 text-center'>{score.X}</td>
										<td className='border px-4 py-2 text-center'>{score.draw}</td>
										<td className='border px-4 py-2 text-center'>{score.O}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div style={{height: '50px'}} className='flex flex-col items-center'>
						{isGameOver && (
							<div className='flex w-55 items-center flex-col'>
								<h2>Winner: {outcome}</h2>
								<button
									className='h-9 w-full bg-white hover:bg-gray-100 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded'
									onClick={resetGame}
								>
									Play again
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
