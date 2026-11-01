/* loopy: the words for Spell It.
   Each word: [picture, word]. The game sorts them by length (3 to 8 letters).
   Edit this file, then run python3 tools/build.py so the offline copy learns about the change. */
// Each word: [picture, word]. The game sorts them by length: 3, 4, 5, and 6 to 8 letters.
// German words are nouns, so they start with a capital letter; the child does not need to type it.
const WORDS = {
  en: [
    ["🐱","cat"],["🐶","dog"],["🐷","pig"],["🐄","cow"],["🚌","bus"],["☀️","sun"],["🎩","hat"],["🛏️","bed"],["☕","cup"],["🥚","egg"],
    ["🦊","fox"],["🦉","owl"],["🐝","bee"],["🐜","ant"],["🦇","bat"],["🐔","hen"],["🚗","car"],["🗺️","map"],["🖊️","pen"],["📦","box"],
    ["🔑","key"],["🥅","net"],["🥜","nut"],["👂","ear"],["🦵","leg"],["6️⃣","six"],["🔟","ten"],["🕸️","web"],["🚐","van"],["🥧","pie"],
    ["🐟","fish"],["🐸","frog"],["🦆","duck"],["🐦","bird"],["🦁","lion"],["🐻","bear"],["🐐","goat"],["🦀","crab"],["🌙","moon"],["⭐","star"],
    ["🌳","tree"],["🚢","ship"],["🎂","cake"],["🥛","milk"],["🚪","door"],["⚽","ball"],["📖","book"],["🪁","kite"],["💡","lamp"],["💍","ring"],
    ["🧦","sock"],["👟","shoe"],["✋","hand"],["👃","nose"],["⛵","boat"],["🥁","drum"],["🌽","corn"],["🍐","pear"],["5️⃣","five"],["9️⃣","nine"],
    ["4️⃣","four"],["🔔","bell"],
    ["🍎","apple"],["🐴","horse"],["🐭","mouse"],["🐑","sheep"],["🐍","snake"],["🐯","tiger"],["🦓","zebra"],["🐳","whale"],["🐌","snail"],["🦈","shark"],
    ["🏠","house"],["🪑","chair"],["🕰️","clock"],["🍞","bread"],["🍇","grape"],["🍋","lemon"],["🍕","pizza"],["🚂","train"],["🚚","truck"],["✈️","plane"],
    ["☁️","cloud"],["❤️","heart"],["7️⃣","seven"],["3️⃣","three"],["8️⃣","eight"],["🤖","robot"],["🎹","piano"],
    ["🐰","rabbit"],["🐵","monkey"],["🐢","turtle"],["🕷️","spider"],["🦜","parrot"],["🍌","banana"],["🥕","carrot"],["🍒","cherry"],["🧀","cheese"],["🍊","orange"],
    ["🚀","rocket"],["🌸","flower"],["✏️","pencil"],["🕯️","candle"],["🎸","guitar"],["🌉","bridge"],["🪟","window"],["🍅","tomato"],["🦒","giraffe"],["🐧","penguin"],
    ["🐬","dolphin"],["🎃","pumpkin"],["🐙","octopus"],["🦄","unicorn"],["🌈","rainbow"],["🐘","elephant"],["☂️","umbrella"],["🥪","sandwich"],["🦕","dinosaur"],["✂️","scissors"],
    ["🦘","kangaroo"],["🍄","mushroom"],["🎒","backpack"]
  ],
  de: [
    ["🎩","Hut"],["🚌","Bus"],["🚂","Zug"],["⌚","Uhr"],["🚲","Rad"],["👂","Ohr"],["🐄","Kuh"],["🐻","Bär"],["🦈","Hai"],["🦌","Reh"],
    ["🍵","Tee"],["🍦","Eis"],["🦶","Fuß"],["💪","Arm"],["🛸","Ufo"],["🥅","Tor"],["🚪","Tür"],
    ["🐶","Hund"],["🐭","Maus"],["🦆","Ente"],["🐰","Hase"],["🦔","Igel"],["🦁","Löwe"],["🐵","Affe"],["🦉","Eule"],["🐓","Hahn"],["🌙","Mond"],
    ["🌳","Baum"],["🏠","Haus"],["⚽","Ball"],["📖","Buch"],["🛏️","Bett"],["🚗","Auto"],["⛵","Boot"],["🍞","Brot"],["✋","Hand"],["👃","Nase"],
    ["🦵","Bein"],["⛺","Zelt"],["🌽","Mais"],["🥜","Nuss"],["🌹","Rose"],["🥝","Kiwi"],["❤️","Herz"],["💍","Ring"],["🍄","Pilz"],["2️⃣","Zwei"],
    ["3️⃣","Drei"],["4️⃣","Vier"],["5️⃣","Fünf"],["8️⃣","Acht"],["9️⃣","Neun"],
    ["🐱","Katze"],["🐟","Fisch"],["🐴","Pferd"],["🐯","Tiger"],["🦓","Zebra"],["🐑","Schaf"],["🐝","Biene"],["🐐","Ziege"],["🦀","Krebs"],["☀️","Sonne"],
    ["⭐","Stern"],["☁️","Wolke"],["🌸","Blume"],["🍎","Apfel"],["🍐","Birne"],["🧀","Käse"],["☕","Tasse"],["💡","Lampe"],["🪑","Stuhl"],["🧦","Socke"],
    ["👟","Schuh"],["🍕","Pizza"],["🎂","Torte"],["6️⃣","Sechs"],["🕯️","Kerze"],["👑","Krone"],["🏝️","Insel"],["🐙","Krake"],
    ["🍌","Banane"],["🚢","Schiff"],["🚀","Rakete"],["🐉","Drache"],["7️⃣","Sieben"],["🌉","Brücke"],["🪟","Fenster"],["🍒","Kirsche"],["🍋","Zitrone"],["🦒","Giraffe"],
    ["🐧","Pinguin"],["🐬","Delfin"],["🐌","Schnecke"],["🐍","Schlange"],["🐘","Elefant"],["🍅","Tomate"],["🥕","Karotte"],["🎸","Gitarre"],["✂️","Schere"],["🕷️","Spinne"],
    ["🦜","Papagei"],["🎃","Kürbis"],["🦄","Einhorn"],["🍓","Erdbeere"],["🎒","Rucksack"],["✈️","Flugzeug"]
  ]
};
