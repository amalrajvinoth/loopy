# Chess Puzzles

Chess puzzles on a wooden board. The child moves the pieces with a tap or a drag. First how each piece moves, then checkmates, winning pieces, defending, clever sacrifices and the rules of a good opening. In German it is called "Schachrätsel". It is the first game in the **Brain games** part of the home page ("Denkspiele" in German).

The levels follow the order a chess school teaches, after the [Superior Chess Academy curriculum](https://superiorchessacademy.com/chess-curriculum.html): checkmates, winning material, defending, sacrificing to win, then openings. loopy adds a first level, Meet the pieces, in front. Only the topic names and their order come from there. The words are loopy's own.

## How to play

1. Read the task above the board, like "White to move. Checkmate in one move!".
2. Tap a piece. Dots show where it can go. A ring shows a piece it can take.
3. Tap where it goes. Or drag it there.
4. Right: the square turns green and one line says why. Wrong: the move goes back, a green arrow shows the right move and one line says why.
5. Tap **Next** for the next puzzle. **Skip** moves on without an answer.

In a puzzle the other side moves first, so the child sees what just happened. In a longer puzzle (mate in two or three) the other side answers each move, and the child plays on. A pawn on the last row asks which piece it becomes.

**Clue:** the first tap makes the right piece wiggle. The second shows where it can go.

On a keyboard, the arrow keys move around the board and **Enter** picks a square.

## Levels and topics

| Level | Ages | Topics |
| --- | --- | --- |
| 1 Meet the pieces | 5 to 6 | The rook, bishop, queen, king, knight and pawn: move it to the star, or take the only black piece it can reach |
| 2 Checkmates | 7 to 8 | Mate in one, mate with a pawn, mate with a pin, mate in two, castling, en passant, a pawn becomes a queen |
| 3 Winning material | 9 to 10 | Forks, pins, skewers, double attacks, discovered attacks, take the defender, a trapped piece, a free piece |
| 4 Defending | 11 to 12 | Stop the threat, save a draw, the in-between move, and "check, mate or stalemate?" |
| 5 Sacrifice to win | 13 to 14 | Sacrifices, decoys, deflection, clearing a line, attacking the king, mate in three |
| 6 Openings and rules | 15 to 16 | Opening rules, opening traps (the Italian Game first), board manners |

The age picks the starting level. The level shows next to the score, like "Level 2 of 6". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one. A level picked by hand in Settings is kept for that age.

Each topic comes in turn the first time, then they mix. The first time a topic comes up, one line explains it, like "New: Forks. A fork: one knight attacks two pieces at once."

## Where the puzzles come from

Level 1 and "check, mate or stalemate?" are made by the game itself. The opening rules and board manners are short questions written for loopy. Every other puzzle is a real one from the [Lichess puzzle database](https://database.lichess.org/#puzzles), which is free for anyone (public domain, CC0). About 14 puzzles were picked for each topic, easy ones first, from puzzles many players liked. `tools/chess/pick.mjs` picks them once, and `tools/chess/build.mjs` checks every move with the game's own rules and writes them into one file per level (`puzzles-2.js` to `puzzles-6.js`). The page loads only the level being played.

## The board

The board is maple and walnut with a dark frame, and the pieces are boxwood and ebony, like a real wooden set. It looks the same in every theme, the way a picture keeps its own colours. Letters and numbers sit on the frame. The child always plays from the bottom of the board.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Level.** The six levels. The level is kept for each age.
- **Topic.** **All for my level**, or one topic of the level.
- **Read aloud.** A speaker button reads the task out loud.
- Age, colors, sound effects and the language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

**Print worksheet** in Settings prints nine boards of the child's level, three across, in black and white, with the letters and numbers round each board. The task is under each board. The child writes the move down or draws an arrow. The answers are on page 2, like "Queen takes on f7".

## Try again

A puzzle that was missed comes back later in **Try again**, as in every game.

## Example help text

- "White to move. Checkmate in one move!"
- "Not quite. The move: Queen takes on f7. Checkmate: the king is attacked and has no way out."
- "New: Forks. A fork: one knight attacks two pieces at once."
