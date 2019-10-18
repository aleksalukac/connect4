# Connect4 Bot

App created in JS for [LambdaWorks challenge](https://lambdaworks.io/challenge).

## Bot logic explained:
After a coin toss (50%) game will choose who will play first (pc or human).

Bot's logic is set into priorities, and they are:
	1. If bot can make a move and win, it will make it.
    2. If opponent has 3 coins in line and can connect the 4th in next move, we will play that move to stop him from winning.
    3. If there is a move that bot can play that lets the opponent win in the next move, bot will avoid that move (*forbidden moves*)
    4. If there is a move that will let us win (not vertical win) by playing the same column, we want our opponent to play that move (*better-not-play moves*)
    5. Bot will find all the safe moves left (moves that are closer to the center of the table are preferred)
    6. Bot will try to play a move that could lead it to a win in its next move (*win in two moves*)
    7. Bot will try to stop the opponent winning in two moves (*example: opponent has two horizontal coins in a row, if we don't prevent it the opponenct could make a winning move in his next move*)
    8. Bot will play a move that can make most 3-in-a-rows
    9. Bot will tryo to play a move that could lead it to a win in 2 moves (*win in three moves*)
    10. If there are no safe moves, bot will play one of better-not-play moves, and if there are none, bot will have to play a forbidden move and lose
    11. If all the previous logic has not given the bot any good choices, it will choose a random safe move (moves in the center are preferred)
