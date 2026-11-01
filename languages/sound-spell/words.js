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
    ["🤐","zip","z","p",1],["🦓","zebra","z","",1]
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
    ["🍋","Zitrone","Z","e",1],["🚗","Auto","Au","o",2],["👁️","Auge","Au","e",2]
  ]
};
// Letters that sound the same in that place, so they are never offered against each other.
const ALIKE = {
  en: { start: [["c", "k"]], end: [] },
  de: { start: [["V", "F"]], end: [["d", "t"], ["g", "k"], ["b", "p"]] }
};
