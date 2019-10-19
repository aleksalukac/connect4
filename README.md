
# Connect4 Bot

App created in JS for [LambdaWorks challenge](https://lambdaworks.io/challenge).
You can try to play this game at [aleksa.lukac.rs/connect4](http://aleksa.lukac.rs/connect4)

## Gameplay and bot logic explained:

To start the game just open the index.html file.
In mind.js is stored the function that makes a move for the bot.
In control.js is everything else.

After a coin toss (50%) game will choose who will play first (pc or human).
Player can place a coin into a chosen column by pressing any field in that column.

Bot's logic is set into priorities, and they are:
Markup : 
1. If bot can make a move and win, it will make it.
2. If opponent has 3 coins in line and can connect the 4th in next move, bot will play that move to stop him from winning.
3. If there is a move that bot can play that lets the opponent win in the next move, bot will avoid that move (*forbidden moves*)
4. If there is a move that will let us win (not vertical win) by playing the same column, bot wants its opponent to play that move (*better-not-play moves*)
5. Bot will find all the safe moves left (moves that are closer to the center of the table are preferred)
6. Bot will try to play a move that could lead it to a win in its next move (*win in two moves*)
7. Bot will try to stop the opponent winning in two moves (*example: opponent has two horizontal coins in a row, if bot doesn't prevent it the opponent could make a winning move in his next move*)
8. Bot will play a move that can make most 3-in-a-rows
9. Bot will try to play a move that could lead it to a win in 2 moves (*win in three moves*)
10. If there are no safe moves, bot will play one of better-not-play moves, and if there are none, bot will have to play a forbidden move and lose
11. If all the previous logic has not given the bot any good choices, it will choose a random safe move (moves in the center are preferred)
