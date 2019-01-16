let fieldSize = 4;
let field = document.querySelector('.cell-container');
let fieldButtonSort = document.querySelector('.shuffle-button');
let generateButton = document.querySelector('.generate-form__button');
let gameOver;



function generateField(fieldSize) {
	let cellSize = calcCellSize(fieldSize);
	let containerMaxWidth = fieldSize * cellSize;
	let numerator = 1;
	let valuesArr = [];

	field.style.width = `${containerMaxWidth}px`;

	for(let i = 0; i < fieldSize * fieldSize - 1; i++) {
		valuesArr[i] = i + 1;
	}

	for(let i = 0; i < fieldSize; i++) {
		for(let j = 0; j < fieldSize; j++) {
			let cell = document.createElement('div');
			cell = setCellStyle(cell, cellSize);
			field.append(cell);

			if(valuesArr.length ===  0) {
				break;
			}

			let randPos = Math.floor(Math.random() * valuesArr.length);
			let curVal = numerator;   //////
			valuesArr.splice(randPos, 1);

			field.insertAdjacentHTML('beforeEnd',
				`<div class="cell-content"
				data-value="${curVal}"
				data-top="${i * cellSize}"
				data-left="${j * cellSize}">
				${curVal}
				</div>`);
			let playCell = field.lastElementChild;
			playCell.style.width = `${cellSize}px`;
			playCell.style.height = `${cellSize}px`;
			playCell.style.top = `${i * cellSize}px`;
			playCell.style.left = `${j * cellSize}px`;
			numerator++;
		}
	}
}

function calcCellSize(fieldSize) {
	let cellSize;

	if(fieldSize >= 8) {
		cellSize = 50;
	} else if(fieldSize >= 6) {
		cellSize = 65;
	} else 	if(fieldSize >= 3) {
		cellSize = 100;
	}

	return cellSize;
}

function setCellStyle(cell, cellSize) {
	cell.classList.add('cell-tile');

	cell.style.width = `${cellSize}px`;
	cell.style.height = `${cellSize}px`;

	return cell;
}

function randomShuffle(e) {
	e.preventDefault();
	if(gameOver) {
		return;
	}
	let cells = field.querySelectorAll('.cell-content');
	let positionsArr = [];

	cells.forEach( item => {
		positionsArr.push([+item.dataset.left, +item.dataset.top]);
		item.classList.remove('cell-win');
	});


	cells.forEach( item => {
		let randPos = Math.floor(Math.random() * positionsArr.length);
		let curPos = {
			x: positionsArr[randPos][0],
			y: positionsArr[randPos][1],
		}; 

		item.style.left = `${curPos.x}px`;
		item.style.top = `${curPos.y}px`;

		item.dataset.left = curPos.x;
		item.dataset.top = curPos.y;

		positionsArr.splice(randPos, 1);
	});
}

function getNeighbor(cellPos, cellSize) {
	let positions = [1, -1];

	let freeCell;
	let direction = [0, 0];

	positions.forEach(val => {
		if(freeCell) {
			return;
		}

		//finding on top and bottom
		let cellToCheck = document.elementFromPoint(
			cellPos.x + cellSize * val,
			cellPos.y);

		if(cellToCheck.matches('.cell-tile')) {
			direction = [val, 0];
			freeCell = cellToCheck;
			return;
		}

			//finding on right and left
			cellToCheck = document.elementFromPoint(
				cellPos.x,
				cellPos.y + cellSize * val);

			if(cellToCheck.matches('.cell-tile')) {
				direction = [0, val];
				freeCell = cellToCheck;
				return;
			}
		});

	if(freeCell) {
		return {
			x: freeCell.getBoundingClientRect().left,
			y: freeCell.getBoundingClientRect().top,
			direction: direction
		};
	}
}

function setNewCellPosition(cell, cellSize, pos) {
	let curCellX = cell.getBoundingClientRect().left;
	let curCellY = cell.getBoundingClientRect().top;
	let newPosition = {
		x: (Math.abs(curCellX - pos.x) ) * pos.direction[0],
		y: (Math.abs(curCellY - pos.y) ) * pos.direction[1],
	}

	let cellTop = parseInt(cell.style.top);
	let cellLeft = parseInt(cell.style.left);

	cellLeft += Math.round(newPosition.x);
	cellTop +=  Math.round(newPosition.y);

	cell.dataset.left = cellLeft;
	cell.dataset.top = cellTop;
	cell.style.left = `${(cellLeft)}px`;
	cell.style.top = `${(cellTop)}px`;

	if(checkWin(cellSize)) {
		stopGame();
	}

}

function stopGame() {
	gameOver = true;
	let cells = field.querySelectorAll('.cell-content');

	cells.forEach( item => {
		item.classList.add('cell-win');
	})

	console.log('ok');
}

function checkMoveIsPossible(cells) {
	let moveIsEnable = true;

	cells.forEach( item => {

		if(!moveIsEnable) {
			return;
		}

		if(Math.round(item.dataset.top) !== parseInt(item.style.top)) {
			console.log(item, parseInt(item.dataset.top), item.style.top);
			moveIsEnable = false;
			return;
		}

		if(Math.round(item.dataset.left) !== parseInt(item.style.left)) {
			console.log(item, parseInt(item.dataset.left), item.style.left);
			moveIsEnable = false;
			return;
		}
	});

	return moveIsEnable;
}

function alignCells(cells, cellSize) {
	//max possible position on X and Y
	let maxVal = cellSize * fieldSize - cellSize;

	cells.forEach( item => {
		if(parseInt(item.style.top) > maxVal) {
			item.style.top = `${maxVal}px`;
		}

		if(parseInt(item.style.top) < 0) {
			item.style.top = `0px`;
		}

		if(parseInt(item.style.left) < 0) {
			item.style.left = `0px`;
		}

		if(parseInt(item.style.left) > maxVal) {
			item.style.left = `${maxVal}px`;
		}
	});
}

function getVirtualPos(top, left, size) {
	return {
		y: Math.round(left / size),
		x: Math.round(top / size)
	}
}

function checkWin(size) {
	let cells = field.querySelectorAll('.cell-content');
	let isWin = true;

	cells.forEach( item => {
		if(!isWin) {
			return;
		}

		let virtualPos = getVirtualPos(item.dataset.top, item.dataset.left, size);
		let gameGridPos = (virtualPos.x * fieldSize + virtualPos.y) + 1;

		if(parseInt(item.dataset.value) !== gameGridPos) {
			isWin = false;
		}

	});

	return isWin;
}

function findNeighborFreeCell(e) {
	if(gameOver) {
		return;
	}
	let cell = e.target.closest('.cell-content');

	if(!cell) {
		return;
	}

	let cells = field.querySelectorAll('.cell-content');
	let cellSize = cell.offsetWidth;

	alignCells(cells, cellSize);

	if(!checkMoveIsPossible(cells)) {
		return;
	}


	let cellPos = {
		x: cell.getBoundingClientRect().left + cellSize / 2,
		y: cell.getBoundingClientRect().top + cellSize / 2
	};

	let newPosition = getNeighbor(cellPos, cellSize);
	//console.log(newPosition.x + ' '+ newPosition.y  + ' N');

	if(newPosition) {
		setNewCellPosition(cell, cellSize, newPosition);
	}
}

function restartGame(Size) {
	if(Size) {
		fieldSize = Size;
	}

	field.innerHTML = '';
	gameOver = false;
	generateField(fieldSize);
}

function checkInputValue() {
	let input = document.querySelector('.generate-form__input');
	let sizeValue = parseInt(input.value);

	if(!sizeValue) {
		return;
	}

	if(sizeValue > 10) {
		sizeValue = 10
	} else if (sizeValue < 3) {
		sizeValue = 3;
	}

	restartGame(sizeValue)
}



document.addEventListener("DOMContentLoaded", generateField(fieldSize));
field.addEventListener('click', findNeighborFreeCell);
fieldButtonSort.addEventListener('click', randomShuffle);
generateButton.addEventListener('click', function(e) {
	e.preventDefault();
	checkInputValue();
});
