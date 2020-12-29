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
/*

function addToColumn(testTable, column, turn = -1)
{
    if(!(testTable[column][5] == 0))
        return false;
	//console.log(table);
	for(var i = 0; i < 6; i++)
	{
		if(testTable[column][i] == 0)
		{
			testTable[column][i] = turn;
			break;
		}
	}
    return true;
*/

function deleteFromColumn(table, column)
{
    numberOfClicks[column]--;
    table[column][numberOfClicks[column]] = 0;
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

function doCoolFalling(column, place, color, i = 5) 
{
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
			{
				document.getElementById((i*10 + j).toString()).style.backgroundColor = document.getElementById((i*10 + j + 1).toString()).style.backgroundColor; 
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
	if(turn == -1)
		return;
	submitButtonStyle(b);
}

function submitButtonStyle(b) {
    if(finished) return;

    if(numberOfClicks[b] == 6) return;

    if(turn == -1){
		doCoolFalling(b, numberOfClicks[b], color_1);
	}
	else
	{
        doCoolFalling(b, numberOfClicks[b], color1);
	} 

    matrix[b][numberOfClicks[b]] = turn;
    turn = -1 * turn;

    numberOfClicks[b]++;

    if(checkTable(matrix) != 2)
        {
			finished = true;
			congratulations(matrix);
			//markWin(matrix, checkTable(matrix));
        }

    if(turn == -1)
        {
			setTimeout(function(){makeBotMove(matrix);},900);
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