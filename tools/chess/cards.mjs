// The Chess Puzzles cards that are not puzzles: opening rules and board manners, in English and German.
// Each card: a picture, then per language [question, right answer, wrong answer, wrong answer, one line that explains].
// Edit here, then run node tools/chess/build.mjs (it writes brain/chess-puzzles/data.js) and python3 tools/build.py.
export const CARDS = {
  rules: [
    { pic: "♟️", en: ["What is a good idea for your first move?", "Put a pawn in the middle", "Move a pawn on the edge", "Bring the queen out", "Pawns in the middle give your pieces room to come out."],
      de: ["Was ist eine gute Idee für deinen ersten Zug?", "Einen Bauern in die Mitte ziehen", "Einen Randbauern ziehen", "Die Dame herausholen", "Bauern in der Mitte machen Platz für deine Figuren."] },
    { pic: "♞", en: ["Why bring knights and bishops out early?", "So they can join the game", "So the king can hide behind them", "To swap them off quickly", "Pieces at home cannot help. Bring them out so they play along."],
      de: ["Warum sollen Springer und Läufer früh heraus?", "Damit sie mitspielen können", "Damit sich der König dahinter versteckt", "Um sie schnell zu tauschen", "Figuren zu Hause helfen nicht. Hol sie heraus, damit sie mitspielen."] },
    { pic: "🏰", en: ["When should you castle?", "Early, to keep the king safe", "Never", "Only at the very end", "Castling early puts the king in a safe corner and brings the rook out."],
      de: ["Wann solltest du rochieren?", "Früh, damit der König sicher ist", "Nie", "Erst ganz am Ende", "Eine frühe Rochade bringt den König in eine sichere Ecke und den Turm ins Spiel."] },
    { pic: "♛", en: ["Should the queen come out on move two?", "No, she can be chased away", "Yes, always", "Only to the edge", "An early queen gets chased by smaller pieces, and you lose time."],
      de: ["Soll die Dame im zweiten Zug heraus?", "Nein, sie kann verjagt werden", "Ja, immer", "Nur an den Rand", "Eine frühe Dame wird von kleineren Figuren gejagt, und du verlierst Zeit."] },
    { pic: "🔁", en: ["How often should one piece move in the opening?", "Once, if you can", "As often as you like", "Three times", "Moving the same piece again and again leaves the others at home."],
      de: ["Wie oft soll eine Figur in der Eröffnung ziehen?", "Einmal, wenn es geht", "So oft du willst", "Dreimal", "Wer immer dieselbe Figur zieht, lässt die anderen zu Hause."] },
    { pic: "🎯", en: ["Which squares are the centre?", "d4, e4, d5 and e5", "a1, h1, a8 and h8", "The squares on the edge", "The four middle squares. Pieces there reach the most squares."],
      de: ["Welche Felder sind das Zentrum?", "d4, e4, d5 und e5", "a1, h1, a8 und h8", "Die Felder am Rand", "Die vier Felder in der Mitte. Von dort erreichen Figuren die meisten Felder."] },
    { pic: "🛡️", en: ["After castling, which pawns should stay at home?", "The pawns in front of the king", "The pawns in the middle", "Only the rook pawns", "Those pawns are the king's wall. Keep the wall standing."],
      de: ["Welche Bauern sollen nach der Rochade stehen bleiben?", "Die Bauern vor dem König", "Die Bauern in der Mitte", "Nur die Randbauern", "Diese Bauern sind die Mauer des Königs. Lass die Mauer stehen."] },
    { pic: "🇮🇹", en: ["In the Italian Game, where does White's bishop go?", "To c4", "To b5", "To e2", "1. e4 e5 2. Nf3 Nc6 3. Bc4: the bishop looks at f7, the weak square next to the black king."],
      de: ["Wohin geht der weiße Läufer in der Italienischen Partie?", "Nach c4", "Nach b5", "Nach e2", "1. e4 e5 2. Sf3 Sc6 3. Lc4: Der Läufer zielt auf f7, das schwache Feld neben dem schwarzen König."] },
    { pic: "👀", en: ["What do you do before every move?", "Look at what the other side wants", "Move as fast as you can", "Only look at your own plan", "Every move can bring a threat. Check it first, then play."],
      de: ["Was tust du vor jedem Zug?", "Schauen, was die andere Seite vorhat", "So schnell wie möglich ziehen", "Nur auf den eigenen Plan schauen", "Jeder Zug kann eine Drohung bringen. Prüf sie zuerst, dann zieh."] },
    { pic: "🪤", en: ["A piece is left free for you. What do you ask first?", "Is it a trap?", "Nothing, just take it", "Whose piece is it?", "A free piece is often a trap. Check what happens after you take it."],
      de: ["Eine Figur steht frei für dich. Was fragst du zuerst?", "Ist das eine Falle?", "Nichts, einfach schlagen", "Wem gehört die Figur?", "Eine freie Figur ist oft eine Falle. Prüf, was nach dem Schlagen passiert."] },
    { pic: "🐴", en: ["Where is a knight weak?", "On the edge", "In the middle", "Next to its king", "A knight on the edge reaches only a few squares."],
      de: ["Wo ist ein Springer schwach?", "Am Rand", "In der Mitte", "Neben seinem König", "Ein Springer am Rand erreicht nur wenige Felder."] }
  ],
  manners: [
    { pic: "🤝", en: ["What do you do before the game starts?", "Shake hands and wish good luck", "Hide one of your pieces", "Start before the other player", "A handshake says: let's have a fair game."],
      de: ["Was tust du, bevor die Partie beginnt?", "Hände schütteln und viel Glück wünschen", "Eine Figur verstecken", "Vor dem anderen anfangen", "Ein Händedruck sagt: Lass uns fair spielen."] },
    { pic: "☝️", en: ["You touch one of your pieces. What now?", "You must move that piece", "You may pick another one", "You miss a turn", "Touch-move: a piece you touch is the piece you move."],
      de: ["Du berührst eine deiner Figuren. Was jetzt?", "Du musst diese Figur ziehen", "Du darfst eine andere nehmen", "Du setzt einmal aus", "Berührt, geführt: Die Figur, die du anfasst, musst du ziehen."] },
    { pic: "📐", en: ["You want to put a piece straight on its square. What do you say first?", "I adjust", "Check", "Nothing", "Say \"I adjust\" first, then the touch does not count as a move."],
      de: ["Du willst eine Figur gerade auf ihr Feld stellen. Was sagst du zuerst?", "Ich rücke zurecht", "Schach", "Nichts", "Sag zuerst \"Ich rücke zurecht\", dann zählt das Anfassen nicht als Zug."] },
    { pic: "🤫", en: ["The other player is thinking. What do you do?", "Stay quiet and wait", "Talk to them", "Tap on the table", "Thinking needs quiet. Wait for your turn."],
      de: ["Der andere denkt nach. Was tust du?", "Leise sein und warten", "Mit ihm reden", "Auf den Tisch klopfen", "Nachdenken braucht Ruhe. Warte, bis du dran bist."] },
    { pic: "🙂", en: ["You lost a game. What do you do?", "Shake hands and say good game", "Knock over the pieces", "Leave without a word", "Good players lose well too. Next time you win."],
      de: ["Du hast eine Partie verloren. Was tust du?", "Hände schütteln und gutes Spiel sagen", "Die Figuren umwerfen", "Ohne ein Wort gehen", "Gute Spieler verlieren auch gut. Nächstes Mal gewinnst du."] },
    { pic: "🏆", en: ["You won a game. What do you do?", "Shake hands and say good game", "Laugh at the other player", "Tell everyone they played badly", "Winning is more fun when the other player feels welcome."],
      de: ["Du hast eine Partie gewonnen. Was tust du?", "Hände schütteln und gutes Spiel sagen", "Den anderen auslachen", "Allen sagen, dass er schlecht war", "Gewinnen macht mehr Spaß, wenn sich der andere willkommen fühlt."] },
    { pic: "📣", en: ["Do you have to say \"check\"?", "No, but it is friendly with beginners", "Yes, or the move does not count", "Only at the end of the game", "The rules do not ask for it. With beginners it is a kind thing to do."],
      de: ["Musst du \"Schach\" sagen?", "Nein, aber bei Anfängern ist es nett", "Ja, sonst zählt der Zug nicht", "Nur am Ende der Partie", "Die Regeln verlangen es nicht. Bei Anfängern ist es freundlich."] },
    { pic: "🧑‍🤝‍🧑", en: ["May a friend help you during a game?", "No, you play on your own", "Yes, always", "Only with the first move", "In a game you think for yourself. Talk about the game together afterwards."],
      de: ["Darf dir ein Freund während der Partie helfen?", "Nein, du spielst allein", "Ja, immer", "Nur beim ersten Zug", "In der Partie denkst du selbst. Sprecht danach zusammen über die Partie."] },
    { pic: "🕊️", en: ["The other player makes a mistake. What do you do?", "Play on and be kind", "Shout about it", "Tell everyone", "Everyone makes mistakes. Play on and be kind."],
      de: ["Der andere macht einen Fehler. Was tust du?", "Weiterspielen und freundlich bleiben", "Laut darüber jubeln", "Allen davon erzählen", "Jeder macht Fehler. Spiel weiter und bleib freundlich."] }
  ]
};
