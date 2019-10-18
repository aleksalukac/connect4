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

	var safeMoves = [];
	for (var i = 0; i < 6; i++)
	{
		if(!forbidden.includes(preferred[i]) && numberOfClicks[preferred[i]] < 6)
		{
			safeMoves.push(preferred[i]);
		}
	}

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
		submitButtonStyle(pos);
		return;
	}

	if(extraSafeMove != -1 && numberOfClicks[extraSafeMove] != 6)
	{	
		submitButtonStyle(extraSafeMove)
		return;
	}

	//If there are no good options, but bot still has to play, bot will play a random move and lose
	if(safeMoves.length == 0 && numberOfClicks[forbidden[0]] < 6)
	{
		submitButtonStyle(forbidden[0]);
		return;
	}

	//If all the logic above has not given the bot any good choices, it will choose a random safe move (moves in the center are preferred)
	var random = Math.floor((Math.random() * (safeMoves.length + 2)) % safeMoves.length);
	submitButtonStyle(safeMoves[random]);
}
