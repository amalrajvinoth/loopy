/* loopy: the words for Sound Spell.
   Each word: [picture, word, starting sound, ending sound (empty = not asked), level]. ALIKE: sounds that are never offered against each other.
   Edit this file, then run python3 tools/build.py so the offline copy learns about the change. */
// Each word: [picture, word, starting sound, ending sound, level]. An empty ending sound means the word
// is only used for starting sounds (silent letters or sounds that two letters make together).
// Level 2 words start or end with a two-letter sound, so they come at age 7 and up.
const WORDS = {
  en: [
    ["🍎","apple","a","",1],["🐜","ant","a","t",1],["⚽","ball","b","",1],["🦇","bat","b","t",1],["🛏️","bed","b","d",1],
    ["🐝","bee","b","",1],["🚌","bus","b","s",1],["👜","bag","b","g",1],["📦","box","b","x",1],["🐱","cat","c","t",1],
    ["🐄","cow","c","",1],["☕","cup","c","p",1],["🚗","car","c","r",1],["🐶","dog","d","g",1],["🦆","duck","d","",1],
    ["🥁","drum","d","m",1],["🥚","egg","e","",1],["🐘","elephant","e","t",2],["🦊","fox","f","x",1],["🐟","fish","f","sh",2],
    ["🐸","frog","f","g",1],["🎁","gift","g","t",1],["🐐","goat","g","t",1],["🎩","hat","h","t",1],["🐔","hen","h","n",1],
    ["🏠","house","h","",1],["🍯","jam","j","m",1],["✈️","jet","j","t",1],["🪁","kite","k","",1],["🔑","key","k","",1],
    ["👑","king","k","",1],["🦁","lion","l","n",1],["🍃","leaf","l","f",1],["💡","lamp","l","p",1],["🌙","moon","m","n",1],
    ["🗺️","map","m","p",1],["🥛","milk","m","k",1],["🥜","nut","n","t",1],["🥅","net","n","t",1],["👃","nose","n","",1],
    ["🦉","owl","o","l",1],["🐙","octopus","o","s",2],["🐷","pig","p","g",1],["🖊️","pen","p","n",1],["🍳","pan","p","n",1],
    ["🐀","rat","r","t",1],["💍","ring","r","",1],["🌧️","rain","r","n",1],["☀️","sun","s","n",1],["🧦","sock","s","",1],
    ["⭐","star","s","r",1],["6️⃣","six","s","x",1],["🚢","ship","sh","p",2],["👟","shoe","sh","",2],["🪑","chair","ch","r",2],
    ["🧀","cheese","ch","",2],["3️⃣","three","th","",2],["⛺","tent","t","t",1],["🌳","tree","t","",1],["🔟","ten","t","n",1],
    ["☂️","umbrella","u","",2],["⬆️","up","u","p",1],["🚐","van","v","n",1],["🕸️","web","w","b",1],["🐺","wolf","w","f",1],
    ["🤐","zip","z","p",1],["🦓","zebra","z","",1],
    ["🐻","bear","b","r",1],["🐦","bird","b","d",1],["🛁","bath","b","th",2],["🚲","bike","b","",1],["📖","book","b","k",1],
    ["⛵","boat","b","t",1],["🧢","cap","c","p",1],["🎂","cake","c","",1],["🥕","carrot","c","t",2],["☁️","cloud","c","d",1],
    ["🌽","corn","c","n",1],["🦀","crab","c","b",1],["🐬","dolphin","d","n",2],["🚪","door","d","r",1],["🪆","doll","d","l",1],
    ["🦌","deer","d","r",1],["👂","ear","e","r",1],["🦅","eagle","e","",2],["🦶","foot","f","t",1],["🍴","fork","f","k",1],
    ["🔥","fire","f","",1],["🥛","glass","g","s",1],["🍇","grape","g","",1],["🟢","green","g","n",1],["✋","hand","h","d",1],
    ["❤️","heart","h","t",1],["🐴","horse","h","",1],["🐹","hamster","h","r",2],["🧊","ice","i","",1],["🦘","kangaroo","k","",2],
    ["🐨","koala","k","",1],["🦵","leg","l","g",1],["🍋","lemon","l","n",1],["🔒","lock","l","k",1],["🪜","ladder","l","r",2],
    ["🐭","mouse","m","",1],["🐵","monkey","m","",2],["🍈","melon","m","n",1],["🪺","nest","n","t",1],["9️⃣","nine","n","",1],
    ["🦦","otter","o","r",2],["🍐","pear","p","r",1],["🐧","penguin","p","n",2],["🎹","piano","p","",1],["🧩","puzzle","p","",2],
    ["👸","queen","qu","n",2],["🤖","robot","r","t",1],["🪨","rock","r","k",1],["🐇","rabbit","r","t",2],["🐌","snail","s","l",2],
    ["🍲","soup","s","p",1],["🧂","salt","s","t",1],["🦈","shark","sh","k",2],["🐑","sheep","sh","p",2],["🐚","shell","sh","l",2],
    ["👕","shirt","sh","t",2],["🐥","chick","ch","k",2],["🍒","cherry","ch","",2],["🦷","tooth","t","th",2],["🐯","tiger","t","r",1],
    ["🐢","turtle","t","",2],["🍅","tomato","t","",2],["🧵","thread","th","d",2],["🦄","unicorn","u","n",2],["🎻","violin","v","n",1],
    ["🌋","volcano","v","",2],["🌊","wave","w","",1],["🪟","window","w","",2],["0️⃣","zero","z","",1],["🧙","wizard","w","d",2],
    ["💧","water","w","r",1],["⌚","watch","w","ch",2],["🧘","yoga","y","",1],["🟡","yellow","y","",1],["🧒","kid","k","d",1]
  ],
  de: [
    ["🍎","Apfel","A","l",1],["🐜","Ameise","A","e",1],["🐵","Affe","A","e",1],["🍍","Ananas","A","s",1],["⚽","Ball","B","",1],
    ["🌳","Baum","B","m",1],["🍞","Brot","B","t",1],["🌸","Blume","B","e",1],["🚌","Bus","B","s",1],["⛵","Boot","B","t",1],
    ["🍌","Banane","B","e",1],["🍐","Birne","B","e",1],["📖","Buch","B","ch",2],["🐉","Drache","D","e",1],["🦖","Dino","D","o",1],
    ["🐟","Fisch","F","sch",2],["🐸","Frosch","F","sch",2],["🦶","Fuß","F","",1],["🥛","Glas","G","s",1],["🦒","Giraffe","G","e",1],
    ["🐶","Hund","H","d",1],["🏠","Haus","H","s",1],["🎩","Hut","H","t",1],["✋","Hand","H","d",1],["❤️","Herz","H","z",1],
    ["🦔","Igel","I","l",1],["🏝️","Insel","I","l",1],["🧥","Jacke","J","e",1],["🐱","Katze","K","e",1],["🐄","Kuh","K","",1],
    ["🕯️","Kerze","K","e",1],["👑","Krone","K","e",1],["🍒","Kirsche","K","e",1],["🧀","Käse","K","e",1],["💡","Lampe","L","e",1],
    ["🦁","Löwe","L","e",1],["🐭","Maus","M","s",1],["🌙","Mond","M","d",1],["🥛","Milch","M","ch",2],["👃","Nase","N","e",1],
    ["🥜","Nuss","N","",1],["🍊","Orange","O","e",1],["🍄","Pilz","P","z",1],["🐧","Pinguin","P","n",1],["🚲","Rad","R","d",1],
    ["💍","Ring","R","",1],["🌹","Rose","R","e",1],["☀️","Sonne","S","e",1],["🥗","Salat","S","t",1],["🧦","Socke","S","e",1],
    ["🐑","Schaf","Sch","f",2],["👟","Schuh","Sch","",2],["❄️","Schnee","Sch","",2],["🔑","Schlüssel","Sch","l",2],["⭐","Stern","St","n",2],
    ["🪑","Stuhl","St","l",2],["☕","Tasse","T","e",1],["🍅","Tomate","T","e",1],["🐯","Tiger","T","r",1],["⌚","Uhr","U","r",1],
    ["🐦","Vogel","V","l",1],["☁️","Wolke","W","e",1],["🐺","Wolf","W","f",1],["🦓","Zebra","Z","a",1],["🚂","Zug","Z","g",1],
    ["🍋","Zitrone","Z","e",1],["🚗","Auto","Au","o",2],["👁️","Auge","Au","e",2],
    ["🐻","Bär","B","r",1],["🛏️","Bett","B","t",1],["🐝","Biene","B","e",1],["🌉","Brücke","B","e",2],["🧈","Butter","B","r",1],
    ["🚪","Tür","T","r",1],["🦆","Ente","E","e",1],["🥚","Ei","Ei","",2],["🦅","Adler","A","r",1],["🥨","Brezel","B","l",2],
    ["🦊","Fuchs","F","s",1],["🪶","Feder","F","r",1],["🪟","Fenster","F","r",2],["🍴","Gabel","G","l",1],["🌿","Gras","G","s",1],
    ["🎁","Geschenk","G","k",2],["🐐","Ziege","Z","e",1],["🐔","Huhn","H","n",1],["🍯","Honig","H","g",1],["🧒","Junge","J","e",1],
    ["🧳","Koffer","K","r",1],["🐫","Kamel","K","l",1],["🪁","Drachen","D","n",2],["🏠","Dach","D","ch",2],["🦌","Reh","R","",1],
    ["🌧️","Regen","R","n",1],["🚀","Rakete","R","e",2],["🐀","Ratte","R","e",1],["🧼","Seife","S","e",1],["🥣","Suppe","S","e",1],
    ["🪨","Stein","St","n",2],["🧦","Strumpf","St","f",2],["🏖️","Strand","St","d",2],["🐌","Schnecke","Sch","e",2],["🏫","Schule","Sch","e",2],
    ["🦢","Schwan","Sch","n",2],["⚔️","Schwert","Sch","t",2],["🧸","Teddy","T","",1],["🌲","Tanne","T","e",1],["🎂","Torte","T","e",1],
    ["🦷","Zahn","Z","n",1],["🎪","Zirkus","Z","s",2],["🪆","Puppe","P","e",1],["🐴","Pferd","P","d",1],["🍕","Pizza","P","a",1],
    ["🦜","Papagei","P","",2],["🪺","Nest","N","t",1],["🌫️","Nebel","N","l",1],["🐷","Schwein","Sch","n",2],["🦉","Eule","E","e",1],
    ["🐘","Elefant","E","t",2],["🧅","Zwiebel","Z","l",2],["🧢","Mütze","M","e",1],["🌊","Meer","M","r",1],["🎵","Musik","M","k",1],
    ["👂","Ohr","O","r",1],["👴","Opa","O","a",1],["👵","Oma","O","a",1],["🪵","Holz","H","z",1],["🏰","Burg","B","g",1],
    ["🌋","Vulkan","V","n",2],["👨","Vater","V","r",1],["🌊","Welle","W","e",1],["🌬️","Wind","W","d",1],["🌲","Wald","W","d",1],
    ["💧","Wasser","W","r",1],["⛰️","Berg","B","g",1],["🦀","Krebs","K","s",1]
  ]
};
// Letters that sound the same in that place, so they are never offered against each other.
const ALIKE = {
  en: { start: [["c", "k"]], end: [] },
  de: { start: [["V", "F"]], end: [["d", "t"], ["g", "k"], ["b", "p"]] }
};
