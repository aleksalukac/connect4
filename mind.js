var preferred = [3, 2, 4, 1, 5, 0];

var positionValue = {};
var bestMovePosition = {};

var max_depth = 6;

var win_points = 1000000;

function max(a,b) { return a > b ? a : b; }
function min(a,b) { return a < b ? a : b; }

function minimizePlay(table, depth = max_depth)
{
	var score = calculateScore(table, -1);

	if (checkTable(table) == 1 || checkTable(table) == -1) 
		return [null, checkTable(table) * win_points];

	if (depth == 0) return [null, score];
    // Column, score
    var min = [null, 99999];

	var values = [];

	var testTable = [];

	for(var i = 0; i < boardSize; i++) 
	{
		testTable[i] = [];
		for(var j=0; j < boardSize; j++) 
		{
			testTable[i][j] = table[i][j];
		}
	}   

	for (var column = 0; column < 6; column++) 
	{
		if (addToColumn(testTable, column, -1))
		{
            var next_move = maximizePlay(testTable, depth - 1);
			values.push(next_move[1]);
			//next_move - array with two elements
			//next_move[0] is the column that will be played
			//next_move[1] is the score of the table after the move

			if (min[0] == null || next_move[1] < min[1]) 
			{				
                min[0] = column;
                min[1] = next_move[1];
			}
			
			deleteFromColumn(testTable, column);
        }
    }

    return min;
}

function maximizePlay(table, depth = max_depth)
{
	var score = calculateScore(table, 1);

	if (checkTable(table) == 1 || checkTable(table) == -1) 
		return [null, checkTable(table) * win_points];
	
	if (depth == 0) return [null, score];

	// Column, Score
	var max = [null, -99999];
	var values = [];
	// For all possible moves

	var testTable = [];

	for(var i = 0; i < boardSize; i++) 
	{
		testTable[i] = [];
		for(var j=0; j < boardSize; j++) 
		{
			testTable[i][j] = table[i][j];
		}
	}

	for (var column = 0; column < 6; column++) 
	{
		if (addToColumn(testTable, column, 1)) 
		{
			var next_move = minimizePlay(testTable, depth - 1); // Recursive calling
			values.push(next_move[1]);

			// Evaluate new move
			if (max[0] == null || next_move[1] > max[1])
			{
				max[0] = column;
				max[1] = next_move[1];
			}
			
			deleteFromColumn(testTable, column);
		}
	}
	
	return max;
}

function makeBotMove(table)
{
	var ai_move = minimizePlay(table);
	submitButtonStyle(ai_move[0]);
	//submitButtonStyle(0);
}

function calculateScore(table, token)
{
	var score = 0;

	for(var j = 2; j <= 3; j++)
		for(var i = 0; i < 6; i++)
		{
			if(table[j][i] == token)
				score += 3;
		}

	for(var i = 0; i < 6; i++)
	{
		for(var c = 0; c < 6 - 3; c++)
		{
			var arrayStart = c;
			var arrayEnd = c + 4;
			score += win_score_heuristic(table[i], token, arrayStart, arrayEnd);
		}

		for(var c = 0; c < 6 - 3; c++)
		{
			var arrayStart = c;
			var arrayEnd = c + 4;
			score += win_score_heuristic(table[i], token, arrayStart, arrayEnd);
		}
	}

	for(var i = 0; i < 6 - 3; i++)
	{
		for(var c = 0; c < 6 - 3; c++)
		{
			var array = [];
			for(var j = 0; j < 4; j++)
			{
				array.push(table[i + j][c + j]);
				score += win_score_heuristic(array, token);
			}

			array = [];
			for(var j = 0; j < 4; j++)
			{
				array.push(table[i + 3 - j][c + j]);
				score += win_score_heuristic(array, token);
			}
		}
	}
	return score * token;
}

function arrayCount(array, arrayStart, arrayStop, element)
{
	var count = 0;

	for(var i = arrayStart; i < arrayStop; i++)
		if(array[i] == element)
			count++;

	return count;
}

function win_score_heuristic(win_array, token, arrayStart, arrayStop)
{
	var score = 0;
	var opponentToken = -token;

	if(arrayCount(win_array, arrayStart, arrayStop, token) == 4)
		score += 100;
	else if(arrayCount(win_array, arrayStart, arrayStop, token)  == 3 && arrayCount(win_array, arrayStart, arrayStop, 0)  == 1)
		score += 5;
	else if(arrayCount(win_array, arrayStart, arrayStop, token)  == 2 && arrayCount(win_array, arrayStart, arrayStop, 0)  == 2)
		score += 2;
		
	if(arrayCount(win_array, arrayStart, arrayStop, opponentToken)  == 3 && arrayCount(win_array, arrayStart, arrayStop, 0) == 1)
		score -= 4;

	return score
}