# Plan: chess puzzles by category

> Picked on 25 Nov 2026: option 1 with add-on C, built as `brain/chess-puzzles/` (issue #355). Only `options.png` of the pictures is kept here; the rest stay in the project files.

Written 25 November 2026. Nothing is built yet. Pick a number, or say "use recommended" for the ⭐ one.

**Goal:** a chess puzzle game where every puzzle belongs to a category, and the categories follow the Superior Chess Academy curriculum that Amal shared.

The pictures are mock-ups drawn on today's site, Black theme, mostly at phone size (390 × 844). `options.png` shows them all on one sheet. The script that made them is in `src/mock.mjs`. In the mock-ups the pieces are font letters. The real game draws its own pieces.

| Picture | Shows |
| --- | --- |
| `options.png` | All options on one sheet |
| `1-mate-in-one.png` | Option 1: a mate-in-one puzzle, rook tapped, its moves shown as dots |
| `1b-wrong-answer.png` | Option 1: after a wrong move, with the right move as an arrow and a one-line why |
| `1c-meet-the-pieces.png` | Option 1: the first level for the youngest, "Hop the knight to every star" |
| `1d-fork-de.png` | Option 1 in German: a fork (Gabel) puzzle |
| `1e-landscape-844x390.png` | Option 1 on a phone on its side |
| `1f-tablet-820x1180.png` | Option 1 on an iPad held upright |
| `1g-small-phone-360x640.png` | Option 1 on the smallest phone |
| `2-topic-map.png` | Option 2: pick a topic from a map of the levels |
| `3-pick-the-move.png` | Option 3: four coloured arrows, four answer buttons |
| `4-five-games-home.png` | Option 4: a Chess section on the home page with six games |
| `5-sprint.png` | Option 5: a timed sprint |

## The curriculum, and how it becomes loopy levels

The academy's page has five levels for ages 5 and up. Students move up when they are ready and never skip a level. Its topics, in its order:

| Academy level | Topics |
| --- | --- |
| 1. Checkmates | Mate in one with queen, rook, bishop and knight · Pawn mates · Mate using a pin or discovery · Mate in two · Castling · En passant · Promotion and underpromotion |
| 2. Winning material | Forks · Pins · Skewers · Double attacks · Discovered attacks · Removing the defender · Trapping pieces · Winning material |
| 3. Defending | Draws and the kinds of draw · Escaping checkmate · Stalemate · Perpetual check · Counterattacks · Defensive moves · Avoiding traps |
| 4. Sacrifice to win | Sacrifices · Opening lines · Attacking the king · Combinations · Decoys and deflections · Mating attacks · Initiative |
| 5. Finding winning moves | Opening rules · Opening ideas for White and Black · Opening traps · Board manners |

The academy starts at checkmates, which assumes a child already knows how the pieces move. A grade 1 child often does not. So loopy adds one level in front, "Meet the pieces". That makes six loopy levels.

| loopy level | Name (EN / DE) | Start age | Topics (the categories) | Where the puzzles come from |
| --- | --- | --- | --- | --- |
| 1 | Meet the pieces / Die Figuren | 5–6 | King, queen, rook, bishop, knight, pawn: catch the stars, take the free piece, which squares can it reach | Made by the game, no data |
| 2 | Checkmates / Schachmatt | 7–8 | The seven academy topics above | Real puzzles |
| 3 | Winning material / Material gewinnen | 9–10 | Forks, pins, skewers, double attacks, discovered attacks, removing the defender, trapped pieces, winning material | Real puzzles |
| 4 | Defending / Verteidigen | 11–12 | Escaping mate, defensive moves, counterattacks, perpetual check, avoiding traps; "check, mate or stalemate?" cards | Real puzzles plus our own cards |
| 5 | Sacrifice to win / Opfern und gewinnen | 13–14 | Sacrifices, opening lines, attacking the king, combinations, decoys and deflections, mating attacks | Real puzzles |
| 6 | Openings / Eröffnungen | 15–16 | Opening rules and board manners as quiz cards, opening traps (Italian Game first) as puzzles | Our own cards plus real puzzles |

The age picker sets the start level, the same way every game does. With the default birthday (August 2018, age 8) a child starts at Checkmates. A child can always step back a level. The level goes up after a run of right answers, like every other game. Inside a level the topics come in the academy's order, then mixed. Within a topic the puzzles get harder by their puzzle rating.

The level names and topic list come from the academy's page. Its page says "© 2026 Superior Chess Academy" and gives no licence. The topic names are ordinary chess words, and loopy writes all of its own text. Nothing is copied from their page. The guide can say "Topics follow a common chess school order" without naming them, or name them if Amal prefers.

## Where the puzzles come from

- **Real puzzles: the Lichess puzzle database.** It is free to use for anything (public domain, CC0). It has about five million puzzles, each with a position, the solution moves, a difficulty rating and theme tags. The tags match the academy topics well: mateIn1, mateIn2, fork, pin, skewer, discoveredAttack, doubleCheck, capturingDefender, trappedPiece, hangingPiece, castling, enPassant, promotion, underPromotion, defensiveMove, equality, sacrifice, deflection, attraction, clearance, kingsideAttack, opening.
- A small script picks about 12 puzzles per topic once, sorted easy to hard. That is about 330 puzzles. The script runs on Amal's Mac, because this cloud cannot reach lichess.org. Its output is checked into the repo. The script itself stays out of the live site.
- **Made by the game:** the "Meet the pieces" level, and the "check, mate or stalemate?" cards.
- **Our own words, in English and German:** opening rules and board manners as four-choice cards, about 20 of each.
- The page has no outside requests. Everything is in the repo.

## How a puzzle works (options 1, 2, 4 and 5)

1. The card says what to find: "White to move. Checkmate in one move!" The board turns so the child's side is at the bottom.
2. The child taps a piece. Dots show where it can go. Then the child taps a square. Dragging works too.
3. Right: green square, "Correct!", stars through `Loopy.rewards.correct()`. In a two-move puzzle, the other side's answer plays by itself, then the child moves again.
4. Wrong: "Not quite.", the right move shown as an arrow, and one plain line on why. Then Next.
5. Any move that gives checkmate counts in a mate puzzle, even if the database lists a different one.
6. Clue: first it lights up the piece to move, then the square.
7. Read aloud says the task and names the pieces ("rook", "Turm").

The game needs its own small move checker. It knows how every piece moves, check, castling, en passant and promotion. It is not a chess engine and does not play against the child.

**Board look.** The board keeps light and dark wooden squares in every theme, like a picture of a real board. The pieces are drawn in the page as small pictures, with an outline that shows on every theme. In High contrast the squares become white and grey.

**Fit.** The board is the main content and grows with the card. The phone on its side hides the title row and puts the text beside the board, as picture 1e shows. On the smallest phone and on a phone on its side each square is about 37 px, under loopy's 44 px tap size. The whole square is the target and dragging works, so this should be fine. It is the first thing to check on a real phone.

**Size.** The shared files and fonts already take about 66 KB of the 100 KB page budget. The game page with its move rules and pieces is about 16 KB. So the puzzles are split into one small file per level, about 3 to 4 KB each, and the page loads only the child's level. The page then sends about 86 KB.

## The options

### 1. ⭐ One game, Chess Puzzles (Schachrätsel), the six levels above

Pictures 1 to 1g. Ages 5 to 16. One game, one home card. The level ladder is the curriculum. The topic shows as a chip at the top of the card ("Checkmates · Mate in one: rook"). In ⚙ a child or grown-up can pick one topic or "All for my level". Tap to move on a real board. A worksheet prints six puzzle diagrams with the loopy logo and the answers small at the bottom.
What Amal will notice: one new card, and the child gets puzzles at the right level straight away.
Cost: large. The move checker and the board are the work. The puzzle data is mostly done by the script.
Why ⭐: it follows the curriculum in order, fits loopy's way of setting difficulty by age, and keeps the home page tidy.

### 2. A topic map first, then ten puzzles

Picture 2. Same game and puzzles as option 1, but it opens on a map of the six levels. Each topic shows how many of its 10 puzzles are done. A child picks a topic, plays 10, and sees a tick. A level opens when the one before is done, like the academy's "never skip a level".
What Amal will notice: clear progress through the curriculum, like a chess workbook.
Cost: large, plus about half a day for the map. It is the only loopy game with a start screen and with locked levels. That goes against "difficulty follows the age picker", and a 13-year-old beginner would have to work through Level 1 first.

### 3. Pick the move: four arrows, four buttons

Picture 3. The board shows four coloured arrows. The child taps A, B, C or D. No tapping on the board.
What Amal will notice: the easiest to play and the quickest to build. It works with a keyboard (1 to 4) like every other game.
Cost: medium. No dots and no dragging, but the game still needs the move checker to make good wrong answers. Weaker learning: guessing among four is easier than finding the move. Mate in two and the defending puzzles do not fit four arrows well.

### 4. A Chess section with six small games

Picture 4. A new "Chess" section on the home page, one game for each loopy level: Meet the Pieces, Checkmate!, Win a Piece, Save the King, Sacrifice to Win, Openings.
What Amal will notice: chess becomes a big part of loopy, and each game has its own stars, best streak and guide page.
Cost: very large. Six game ids, six READMEs, six guide pages in two languages, six places in every shared list. The board code is shared through a new part loaded with `Loopy.load()`. Hard to keep in step later.

### 5. Chess Sprint: as many as you can in 3 minutes

Picture 5. A timer, a right and wrong count, and a puzzle score that goes up after a right answer and down after a wrong one, like on Lichess. Puzzles come from all topics at the child's score.
What Amal will notice: exciting for older kids who already play.
Cost: medium, on top of option 1's board. Not good as the only chess game: it teaches no topics and stresses younger children. Best as a later add-on.

### Add-ons (with any option)

- **A. Today's 10.** I recommend **not now**. Today's 10 is a daily school mix with four answer buttons. A board and move rules would add about 12 KB and almost double that page. Later, mate in one as "pick the move" (option 3's style) could join for ages 8 and up, if Amal wants chess in the daily streak.
- **B. Coordinates for older kids.** From level 4, letters a to h and numbers 1 to 8 show on the board, and the explanation names moves the way chess books do ("Rd8#" in English, "Td8#" in German).
- **C. "How it works" card for each topic.** The first time a topic comes up, a small card shows one line and a picture ("A fork attacks two pieces at once."). It can be shown again from the clue button.

## Other decisions

- **Home page section.** ⭐ A new section "Brain games" (German "Denkspiele"), after Geography. It has room for later games like Sudoku or logic puzzles. Other choice: put it under Math. Option 4 would use a "Chess" section instead.
- **German.** Chess words in German: König, Dame, Turm, Läufer, Springer, Bauer; Schach, Matt, Patt, Rochade, en passant, Umwandlung, Gabel, Fesselung, Spieß, Abzugsangriff. "Weiß am Zug" and "Schwarz am Zug".
- **Try again.** Each wrong answer saves the puzzle's id, so `Loopy.retry.fresh` can bring it back.
- **Saved data.** One new game id. Nothing old changes.

## What I need from Amal

Type a number, several numbers, "go" or "use recommended" (that is 1, with add-on C and the Brain games section).
