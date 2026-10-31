// Every loopy game, in the same order as the home page (index.html GAMES).
// path: the game's folder on the site. The guide page is games/<path>.mdx (Today's 10: games/todays-10.mdx).
// tools/guide_check.py fails if a game on the home page has no guide page in English and German.
export type Game = { path: string; pic: string; ages: [number, number]; subject: string; en: string; de: string; slug: string };

const g = (subject: string, folder: string, pic: string, ages: [number, number], en: string, de: string): Game =>
  ({ path: `${subject}/${folder}/`, pic, ages, subject, en, de, slug: `games/${subject}/${folder}` });

export const TODAY: Game = { path: "mix/daily-mix/", pic: "📅", ages: [5, 16], subject: "mix", en: "Today's 10", de: "Die 10 von heute", slug: "games/todays-10" };

export const GAMES: Game[] = [
  g("math", "plus-minus", "➕", [5, 16], "Plus and Minus", "Plus und Minus"),
  g("math", "times-share", "✖️", [6, 16], "Times and Share", "Mal und Teilen"),
  g("math", "what-time-is-it", "🕒", [5, 12], "What Time Is It?", "Wie spät ist es?"),
  g("math", "make-10", "🔟", [5, 11], "Make 10", "Ergänze bis 10"),
  g("math", "bigger-or-smaller", "⚖️", [6, 12], "Bigger or Smaller", "Größer oder kleiner"),
  g("math", "pizza-fractions", "🍕", [7, 11], "Pizza Fractions", "Pizza-Brüche"),
  g("math", "coins-change", "💰", [6, 12], "Coins and Change", "Münzen und Wechselgeld"),
  g("math", "equation-balance", "🧮", [10, 16], "Equation Balance", "Waage"),
  g("math", "times-sprint", "⏱️", [5, 16], "Times Tables Sprint", "Einmaleins-Sprint"),
  g("math", "percent-ratio", "💯", [10, 16], "Percent and Ratio", "Prozent und Verhältnis"),
  g("math", "graphs-data", "📊", [8, 14], "Graphs and Data", "Diagramme und Daten"),
  g("math", "box-multiply", "🔲", [7, 12], "Box Multiplication", "Malkreuz"),
  g("math", "step-by-step", "🪜", [6, 12], "Step by Step", "Schrittweise rechnen"),
  g("math", "shapes-angles", "📐", [7, 14], "Shapes and Angles", "Formen und Winkel"),
  g("languages", "sound-spell", "👂", [5, 8], "Sound Spell", "Anlaut und Endlaut"),
  g("languages", "word-match", "🖼️", [5, 10], "Word Match", "Bild und Wort"),
  g("languages", "spell-it", "✏️", [6, 10], "Spell It", "Wörter schreiben"),
  g("languages", "sentence-builder", "🧩", [6, 12], "Sentence Builder", "Satzbau"),
  g("languages", "spelling-quiz", "🐝", [6, 12], "Spelling Quiz", "Rechtschreib-Quiz"),
  g("languages", "word-detective", "🕵️", [6, 14], "Word Detective", "Wortdetektiv"),
  g("science", "quick-facts", "🔬", [7, 12], "Quick Facts", "Blitzwissen"),
  g("science", "sort-it", "🗂️", [6, 12], "Sort It", "Sortieren"),
  g("geography", "where-is-it", "🗺️", [7, 14], "Where Is It?", "Wo liegt das?"),
  g("geography", "flags-capitals", "🚩", [7, 16], "Flags and Capitals", "Flaggen und Hauptstädte"),
];

export const SUBJECTS: Record<string, { en: string; de: string; pic: string }> = {
  math: { en: "Math", de: "Mathe", pic: "🔢" },
  languages: { en: "Languages", de: "Sprachen", pic: "🔤" },
  science: { en: "Science", de: "Naturwissenschaft", pic: "🔬" },
  geography: { en: "Geography", de: "Erdkunde", pic: "🌍" },
};

export const ALL = [TODAY, ...GAMES];
