var finished = false;  
var boardSize;
var startTime = performance.now();
//var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
//upper line is used if we want to measure the time length of the game

var matrix = [];

var numberOfClicks = [];

var turn = -1;

function addToColumn(table, column, turn = -1)
{
    if(numberOfClicks[column] >= 6)
        return false;
    //console.log(table);
    table[column][numberOfClicks[column]] = turn;
    numberOfClicks[column]++;
    return true;
}

function deleteFromColumn(table, column)
{
    numberOfClicks[column]--;
    table[column][numberOfClicks[column]] = 0;
}

var preferred = [3, 2, 4, 1, 5, 0];

function makeBotMove(table)
{
	var moveOrder = 0;
	for(var i = 0; i < 6; i++)
	{
		moveOrder += numberOfClicks[i];
	}
	if(moveOrder == 1)
	{
		console.log("Our first move");
		if(numberOfClicks[3] == 0) submitButtonStyle(3);
		else
			submitButtonStyle(2);
		
		return;
	}
    //let testTable = Object.assign({}, table);
	//var testTable = JSON.parse(JSON.stringify(table));_.cloneDeep(obj);
	//these lines didn't work cause testTable still referenced to table (js is stupid ¯\_(ツ)_/¯ )

	var testTable = [];

	for(var i=0; i < boardSize; i++) {
       	testTable[i] = [];
        for(var j=0; j < boardSize; j++) {
            testTable[i][j] = table[i][j];
        }
    }   

	//check if I can win by playing any move
	for (var i = 0; i < 6; i++)
	{
		if (addToColumn(testTable, i))
		{
			if (checkTable(testTable) == -1)
			{
				deleteFromColumn(testTable, i);
				console.log("Winning: " + i.toString());
				submitButtonStyle(i);
                return;
			}
			deleteFromColumn(testTable, i);
		}
	}

	//check if opponent can win by playing any move
	for (var i = 0; i < 6; i++)
	{
		if (addToColumn(testTable, i, 1))
		{
			if (checkTable(testTable) == 1)
			{
				deleteFromColumn(testTable, i);
				console.log("Protecting: " + i.toString());
				submitButtonStyle(i);
				return;
			}
			deleteFromColumn(testTable, i);
		}
	}
	
	var forbidden = []; //if we play one of these moves, opponent can win in his next move 
	var betterNotPlay = []; //we are trying to avoid these moves and we want our opponent to play them first, so we could win in the next move

	for (var i = 0; i < 6; i++)
	{
		for (var j = 0; j < 6; j++)
		{
			if (addToColumn(testTable, i))
			{
				if(addToColumn(testTable, j, 1))
				{
					if(checkTable(testTable) == 1)
					{
						deleteFromColumn(testTable, i);
						deleteFromColumn(testTable, j);
						forbidden.push(i);
						break;
					}
					deleteFromColumn(testTable, j);
				}
				deleteFromColumn(testTable, i);
			}
		}
	}

	console.log("Forbidden: ");
	console.log(forbidden);

	var safeMoves = [];
	for (var i = 0; i < 6; i++)
	{
		if(!forbidden.includes(preferred[i]) && numberOfClicks[preferred[i]] < 6)
		{
			safeMoves.push(preferred[i]);
		}
	}

	console.log("Safe moves: ");
	console.log(safeMoves);

	var potential = []; //these moves could lead us to a win in 2 moves
	for(var i = 0; i < safeMoves.length; i++)
		potential.push(0);

	for (var i = 0; i < safeMoves.length; i++)
	{
		for (var j = 0; j < 6; j++)
		{
			if (addToColumn(testTable, safeMoves[i]))
			{
				if(addToColumn(testTable, j))
				{
					if(checkTable(testTable) == -1)
					{
						if(safeMoves[i] == j && checkVertical(testTable) != -1)
						{
							forbidden.unshift(j);
							betterNotPlay.push(j);
						}
						else
						{
							potential[safeMoves[i]]++;
						}
						deleteFromColumn(testTable, safeMoves[i]);
						deleteFromColumn(testTable, j);
						
						continue;
					}
					deleteFromColumn(testTable, j);
				}
				deleteFromColumn(testTable, safeMoves[i]);
			}
		}
	}

	for(var i = 0; i < safeMoves.length; i++)
	{
		for(var j = 0; j < betterNotPlay.length; j++)
		{
			if(safeMoves[i] == betterNotPlay[j])
			{
				safeMoves.splice(i, 1);
			}
		}
	}

	var max = 0;
	var pos = 0;
	for (var i = 0; i < safeMoves.length; i++)
	{
		if(potential[safeMoves[i]] > max)
		{
			max = potential[safeMoves[i]];
			pos = safeMoves[i];
		}
	}

	if(max > 0 && numberOfClicks[pos] < 6)
	{
		console.log("Potential win in 2 moves: " + pos.toString());
		submitButtonStyle(pos);
		return;
	}

	//if opponent can win in 2 moves, we will try to stop him
	potential = []; //these moves could lead us to a win in 2 moves
	for(var i = 0; i < safeMoves.length; i++)
		potential.push(0);

	for (var i = 0; i < safeMoves.length; i++)
	{
		for (var j = 0; j < 6; j++)
		{
			if (addToColumn(testTable, safeMoves[i], 1))
			{
				if(addToColumn(testTable, j, 1))
				{
					if(checkTable(testTable) == 1)
					{
						deleteFromColumn(testTable, safeMoves[i]);
						deleteFromColumn(testTable, j);
						
						//console.log("Potential winning move: " + safeMoves[i].toString());
						
						potential[safeMoves[i]]++;
						continue;
					}
					deleteFromColumn(testTable, j);
				}
				deleteFromColumn(testTable, safeMoves[i]);
			}
		}
	}

	var extraSafeMove = -1;
	var max = 0;
	var pos = 0;

	for (var i = 0; i < safeMoves.length; i++)
	{
		if(potential[safeMoves[i]] > max)
		{
			max = potential[safeMoves[i]];
			pos = safeMoves[i];
		}
	}

	if(max > 1 && numberOfClicks[pos] < 6) //if it is not too dangerous, we will rather play a more "aggressive" move
	{
		//console.log("Potential lose in 2 moves: " + pos.toString());
		submitButtonStyle(pos);
		return;
	}
	else
	{
		if(max != 0)
		{
			extraSafeMove = pos;
		}
	}

	//can we connect 3 in line
	var max3InLine = checkThreeInLine(testTable);
	var move = -1;

	for(var i = 0; i < safeMoves.length; i++)
	{
		if (addToColumn(testTable, safeMoves[i]))
		{
			var inLine = checkThreeInLine(testTable);

			if(inLine > max3InLine)
			{
				max3InLine = inLine;
				move = i;
			}
			deleteFromColumn(testTable, safeMoves[i]);
		}
	}
	if(move != -1)
	{
		console.log("Idemo po 3 u nizu");
		submitButtonStyle(safeMoves[move]);
		return;
	}

	//now trying to find potential wins in 3 moves

	for(var i = 0; i < safeMoves.length; i++)
		potential[i] = 0;

	for (var i = 0; i < safeMoves.length; i++)
	{
		for (var j = 0; j < 6; j++)
		{
			for(var k = 0; k < 6; k++)
			{
				if (addToColumn(testTable, safeMoves[i]))
				{
					if(addToColumn(testTable, j))
					{
						if(addToColumn(testTable, k))
						{
							if(checkTable(testTable) == -1)
							{
								deleteFromColumn(testTable, safeMoves[i]);
								deleteFromColumn(testTable, j);
								deleteFromColumn(testTable, k);
								
								//console.log("Potential3: " + safeMoves[i].toString());
								
								potential[safeMoves[i]]++;
								continue;
							}
							deleteFromColumn(testTable, k);
						}
						
						deleteFromColumn(testTable, j);
					}
					deleteFromColumn(testTable, safeMoves[i]);
				}
			}
			
		}
	}
	max = 0;
	pos = 0;
	for (var i = 0; i < safeMoves.length; i++)
	{
		if(potential[safeMoves[i]] > max)
		{
			max = potential[safeMoves[i]];
			pos = safeMoves[i];
		}
	}
	if(max > 0 && numberOfClicks[pos] < 6)
	{
		console.log("Potential win in 3 moves: " + pos.toString());
		submitButtonStyle(pos);
		return;
	}

	if(extraSafeMove != -1 && numberOfClicks[extraSafeMove] != 6)
	{	
		console.log("Protecting from potential lose in 2 moves " + extraSafeMove.toString());
		submitButtonStyle(extraSafeMove)
		return;
	}

	//If there are no good options, but bot still has to play, bot will play a random move and lose
	if(safeMoves.length == 0 && numberOfClicks[forbidden[0]] < 6)
	{
		console.log("Surrender: " + forbidden[0].toString());
		submitButtonStyle(forbidden[0]);
		return;
	}

	//If all the logic above has not given the bot any good choices, it will choose a random safe move (moves in the center are preferred)
	var random = Math.floor((Math.random() * (safeMoves.length + 2)) % safeMoves.length);
	console.log("Choosing random safe move: " + safeMoves[random].toString());
	submitButtonStyle(safeMoves[random]);
}

function setup(size)
{
    var solved = [];
    boardSize = size;
    for(var i=0; i < boardSize; i++) {
        matrix[i] = [];
        numberOfClicks[i] = 0;
        for(var j=0; j < boardSize; j++) {
            matrix[i][j] = 0;
        }
    }   
    if(Math.random() > 0.5 == 0)
            turn = 1;
        else
            {
                turn = -1;
                submitButtonStyle(3);
                //makeBotMove();
            }
}

var color_1 = "#F10026";
var color1 = "#3d9ad1";
var neutralColor = "#808080";
//var canDoFalling = true;

function doCoolFalling(column, place, color, i = 5) {
	if(place == 5) {
		document.getElementById((column * 10 + 5).toString()).style.backgroundColor = color; 
		return;  
	}
    if(i < place) return;

    if(i + 1 <= 5)
        {
            document.getElementById((column*10 + i+1).toString()).style.backgroundColor = neutralColor; 
        }

    document.getElementById((column * 10 + i).toString()).style.backgroundColor = color;   

    setTimeout(function() { doCoolFalling(column,place,color,i-1)}, 120);
}

function dropTableFalling(max, table = matrix, k = 0) {
	if(k == 7)
	{
		//setTimeout(function() {location.reload()}, max * 200);
		setup(6);
		setTimeout(function() {location.reload()}, 400);
		return;
	}
		
	for(var i = 0; i < 6; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			if(j == 5)
			{
				document.getElementById((i*10 + j).toString()).style.backgroundColor = neutralColor;
			}
			else
			{document.getElementById((i*10 + j).toString()).style.backgroundColor = document.getElementById((i*10 + j + 1).toString()).style.backgroundColor; 
		

			}
		}
	}
	setTimeout(function () { dropTableFalling(max, table, k+1)}, 200);

}

function congratulations(table){
    // alert("Congratulations!");
	
	var res = checkTable(table);

	if(res == 1)
	{
		document.getElementById("cong").innerText = 'Congratulations! You have won! \n\n Play another game! :)';
    
	}
	else if(res == -1)
	{
		document.getElementById("cong").innerText = 'You have lost! :( \n\n Play another game!';
	}
	else 
	{
		document.getElementById("cong").innerText = 'It\'s a stalemate :| \n\n Play another game!';
	}
}

function newGame() {

	finished = true;
	var max = numberOfClicks[0];
	for(var i = 1; i < 6; i++)
	{
		if(numberOfClicks[i] > max)
			max = numberOfClicks[i];
	}
	dropTableFalling(max);
}

function submitButtonStyleFromPlayer(b) {
	if(turn == -1 /*&& canDoFalling*/)
	return
	submitButtonStyle(b);
}

function submitButtonStyle(b) {
    if(finished) return;

    if(numberOfClicks[b] == 6) return;

	//canDoFalling = false;
    if(turn == -1){
		doCoolFalling(b, numberOfClicks[b], color_1);
        //document.getElementById((b*10 + numberOfClicks[b]).toString()).style.backgroundColor = color_1; 

    }
    else{
        doCoolFalling(b, numberOfClicks[b], color1);
        //document.getElementById((b*10 + numberOfClicks[b]).toString()).style.backgroundColor = color1;
	} 
	
	//setTimeout(function() { canDoFalling = true}, 300);

    matrix[b][numberOfClicks[b]] = turn;

    //console.log(matrix);

    turn = -1 * turn;

    numberOfClicks[b]++;

    //console.log(checkTable(matrix));

    if(checkTable(matrix) != 2)
        {
			finished = true;
			congratulations(matrix);
        }

    if(turn == -1)
        {
			setTimeout(function(){makeBotMove(matrix);},900);
           
           //turn = 1;
        }

    //wait(50);
    //check();
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function checkHorizontalThreeInLine(table)
{
	var sum = 0;

	for (var i = 0; i < 6; i++)
	{
		var inRow = 0;
		var player = 5;

		for (var j = 0; j < 6; j++)
		{
			if (table[j][i] == 0)
			{
				inRow = 0;
				player = 5;
				continue;
			}
			if (table[j][i] == player)
			{
				if (++inRow == 3 && player == -1)
					sum++;
			}
			else
			{
				inRow = 1;
				player = table[j][i];
			}
		}
	}
	return sum;
}

function checkHorizontal(table)
{
	for (var i = 0; i < 6; i++)
	{
		var inRow = 0;
		var player = 5;

		for (var j = 0; j < 6; j++)
		{
			if (table[j][i] == 0)
			{
				inRow = 0;
				player = 5;
				continue;
			}
			if (table[j][i] == player)
			{
				if (++inRow == 4)
					return player;
			}
			else
			{
				inRow = 1;
				player = table[j][i];
			}
		}
	}
	return 2;
}

function checkVertical(table)
{
	for (var  i = 0; i < 6; i++)
	{
		var inRow = 0;
		var player = 5;

		for (var j = 0; j < 6; j++)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;
				continue;
			}
			if (table[i][j] == player)
			{
				if (++inRow == 4)
					return player;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}
		}
	}
	return 2;
}

function checkVerticalThreeInLine(table)
{
	var sum = 0;

	for (var  i = 0; i < 6; i++)
	{
		var inRow = 0;
		var player = 5;

		for (var j = 0; j < 6; j++)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;
				continue;
			}
			if (table[i][j] == player)
			{
				if (++inRow == 3 && player == -1)
					sum++;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}
		}
	}
	return sum;
}

var listOfi = [ 0, 0, 0, 1, 2, 5, 5, 5, 4, 3, -1 ]; //coordinates of the starts the diagonals to check
var listOfj = [ 3, 4, 5, 5, 5, 3, 4, 5, 5, 5, -1 ];

function checkDiagonal(table)
{
	var order = 0;
	var i = listOfi[order];
	var j = listOfj[order];

	var movei = 1, movej = -1;
	var inRow = 0;
	var player = 5;
	
	while (i != 5)
	{
		while (j >= 0 && j < 6 && i >= 0 && i < 6)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;

				i += movei;
				j += movej;
				continue;
			}

			if (table[i][j] == player)
			{
				if (++inRow == 4)
					return player;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}

			i += movei;
			j += movej;
		}
		i = listOfi[++order];
		j = listOfj[order]; 
		inRow = 0;
		player = 5;
	}

	movei = -1;
	movej = -1;

	while (i != -1)
	{
		while (j >= 0 && j < 6 && i >= 0 && i < 6)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;

				i += movei;
				j += movej;
				continue;
			}

			if (table[i][j] == player)
			{
				if (++inRow == 4)
					return player;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}

			i += movei;
			j += movej;
		}
		i = listOfi[++order];
		j = listOfj[order];
		inRow = 0;
		player = 5;
	}

	return 2;
}

function checkDiagonalThreeInLine(table)
{
	var order = 0;
	var i = listOfi[order];
	var j = listOfj[order];

	var movei = 1, movej = -1;
	var inRow = 0;
	var player = 5;

	var sum = 0;
	
	while (i != 5)
	{
		while (j >= 0 && j < 6 && i >= 0 && i < 6)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;

				i += movei;
				j += movej;
				continue;
			}

			if (table[i][j] == player)
			{
				if (++inRow == 3 && player == -1)
					sum++;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}

			i += movei;
			j += movej;
		}
		i = listOfi[++order];
		j = listOfj[order]; 
		inRow = 0;
		player = 5;
	}

	movei = -1;
	movej = -1;

	while (i != -1)
	{
		while (j >= 0 && j < 6 && i >= 0 && i < 6)
		{
			if (table[i][j] == 0)
			{
				inRow = 0;
				player = 5;

				i += movei;
				j += movej;
				continue;
			}

			if (table[i][j] == player)
			{
				if (++inRow == 3)
					sum++;
			}
			else
			{
				inRow = 1;
				player = table[i][j];
			}

			i += movei;
			j += movej;
		}
		i = listOfi[++order];
		j = listOfj[order];
		inRow = 0;
		player = 5;
	}

	return sum;
}

function checkTable(table) //return -1 or 1 if the game is won by any player, 0 if it is a stalemate and 2 if neither
{
	var horizontal = checkHorizontal(table);
	if (horizontal == 1 || horizontal == -1) return horizontal;

	var vertical = checkVertical(table);
	if (vertical == 1 || vertical == -1) return vertical;

	var diagonal = checkDiagonal(table);
	if (diagonal == 1 || diagonal == -1) return diagonal;

	var emptyCells = 0;

	for (var i = 0; i < 6; i++)
	{
		emptyCells += 6 - numberOfClicks[i];
	}

	if (emptyCells == 0)
		return 0;
	return 2;
}

function checkThreeInLine(table)
{
	var hor = checkHorizontalThreeInLine(table);
	var ver = checkVerticalThreeInLine(table);
	var diag = checkDiagonalThreeInLine(table);

	return hor + ver + diag;
	//return checkHorizontalThreeInLine(table) + checkVerticalThreeInLine(table) + checkDiagonalThreeInLine(table);
}