/* loopy: the shared word bank for Word Match and Word Trail.
   15 topics. Each word: [picture, English, German]. Word Trail uses every word of three letters or more that has no space in it.
   A word with a 4th value, its Word Match level (1 = from age 6, 2 = from age 7), is also in Word Match, with its German article.
   A 5th value of 0 means Word Match only (the word is too long for a grid, or Word Trail uses another German word for it).
   Edit this file, then run python3 tools/build.py so the offline copy learns about the change. */
const LOOPY_WORDS = [
  ["animals", "🐾", [
    ["🐶", "dog", "der Hund", 1], ["🐱", "cat", "die Katze", 1], ["🐟", "fish", "der Fisch", 1], ["🐦", "bird", "der Vogel", 1], ["🐄", "cow", "die Kuh", 1], ["🐷", "pig", "das Schwein", 1],
    ["🐴", "horse", "das Pferd", 1], ["🐑", "sheep", "das Schaf", 1], ["🐭", "mouse", "die Maus", 1], ["🐰", "rabbit", "der Hase", 1], ["🦆", "duck", "die Ente", 1], ["🐸", "frog", "der Frosch", 1],
    ["🐻", "bear", "der Bär", 1], ["🦁", "lion", "der Löwe", 1], ["🐵", "monkey", "der Affe", 1], ["🐝", "bee", "die Biene", 1], ["🐔", "hen", "das Huhn", 1], ["🦊", "fox", "der Fuchs", 1],
    ["🐘", "elephant", "der Elefant", 2], ["🦒", "giraffe", "die Giraffe", 2], ["🐍", "snake", "die Schlange", 2], ["🦉", "owl", "die Eule", 2], ["🐧", "penguin", "der Pinguin", 2], ["🐺", "wolf", "Wolf"],
    ["🐯", "tiger", "Tiger"], ["🐐", "goat", "Ziege"], ["🦌", "deer", "Reh"], ["🐜", "ant", "Ameise"], ["🐪", "camel", "Kamel"], ["🦓", "zebra", "Zebra"],
    ["🐳", "whale", "Wal"], ["🦈", "shark", "Hai"], ["🦀", "crab", "Krebs"], ["🦭", "seal", "Robbe"], ["🦢", "swan", "Schwan"], ["🦔", "hedgehog", "Igel"],
    ["🫏", "donkey", "Esel"], ["🐢", "turtle", "die Schildkröte", 2, 0], ["🦋", "butterfly", "der Schmetterling", 2, 0]
  ]],
  ["food", "🍎", [
    ["🍎", "apple", "der Apfel", 1], ["🍌", "banana", "die Banane", 1], ["🍞", "bread", "das Brot", 1], ["🧀", "cheese", "der Käse", 1], ["🥚", "egg", "das Ei", 1], ["🥛", "milk", "die Milch", 1],
    ["🍐", "pear", "die Birne", 1], ["🥕", "carrot", "die Karotte", 1], ["🍅", "tomato", "die Tomate", 1], ["🍕", "pizza", "die Pizza", 1], ["🍰", "cake", "der Kuchen", 1], ["🍊", "orange", "die Orange", 1],
    ["🍪", "cookie", "der Keks", 1], ["🧈", "butter", "die Butter", 1], ["🍋", "lemon", "die Zitrone", 2], ["🍯", "honey", "der Honig", 2], ["🍚", "rice", "der Reis", 2], ["🍲", "soup", "Suppe"],
    ["🥜", "nut", "Nuss"], ["🧂", "salt", "Salz"], ["🧃", "juice", "Saft"], ["🍵", "tea", "Tee"], ["🌽", "corn", "Mais"], ["🍑", "plum", "Pflaume"],
    ["🍇", "grape", "Traube"], ["🍈", "melon", "Melone"], ["🧅", "onion", "Zwiebel"], ["🫑", "pepper", "Paprika"], ["🍝", "noodle", "Nudel"], ["🍦", "ice", "Eis"],
    ["🥐", "roll", "Brötchen"], ["🍓", "berry", "Beere"], ["🥗", "salad", "Salat"], ["🍫", "candy", "Bonbon"], ["🍦", "ice cream", "das Eis", 1, 0], ["🍓", "strawberry", "die Erdbeere", 2, 0],
    ["🍇", "grapes", "die Trauben", 2, 0], ["🥔", "potato", "die Kartoffel", 2, 0], ["🥒", "cucumber", "die Gurke", 2, 0], ["🍫", "chocolate", "die Schokolade", 2, 0], ["🍒", "cherries", "die Kirschen", 2, 0], ["🍝", "noodles", "die Nudeln", 2, 0]
  ]],
  ["home", "🏠", [
    ["🏠", "house", "das Haus", 1], ["🚪", "door", "die Tür", 1], ["🪟", "window", "das Fenster", 1], ["🛏️", "bed", "das Bett", 1], ["🪑", "chair", "der Stuhl", 1], ["🛋️", "sofa", "das Sofa", 1],
    ["💡", "lamp", "die Lampe", 1], ["🕰️", "clock", "die Uhr", 1], ["🥄", "spoon", "der Löffel", 1], ["☕", "cup", "die Tasse", 1], ["🧼", "soap", "die Seife", 1], ["🕯️", "candle", "die Kerze", 1],
    ["🛁", "bath", "Bad"], ["🚿", "shower", "die Dusche", 2], ["🍽️", "plate", "der Teller", 2], ["🧹", "broom", "der Besen", 2], ["🧺", "basket", "der Korb", 2], ["🪞", "mirror", "der Spiegel", 2],
    ["🏚️", "roof", "Dach"], ["🪵", "table", "Tisch"], ["🍴", "fork", "Gabel"], ["🔪", "knife", "Messer"], ["🍳", "pot", "Topf"], ["♨️", "oven", "Ofen"],
    ["🛌", "pillow", "Kissen"], ["🧣", "blanket", "Decke"], ["🌷", "garden", "Garten"], ["🧱", "wall", "Wand"], ["🪜", "stairs", "Treppe"], ["🧻", "towel", "Handtuch"],
    ["📦", "box", "Kiste"], ["🔑", "key", "der Schlüssel", 1], ["🧸", "teddy bear", "der Teddy", 1, 0], ["🧦", "sock", "die Socke", 1, 0], ["👕", "T-shirt", "das T-Shirt", 1, 0], ["🛁", "bathtub", "die Badewanne", 2, 0],
    ["🚽", "toilet", "die Toilette", 2, 0], ["📺", "TV", "der Fernseher", 2, 0], ["☂️", "umbrella", "der Regenschirm", 2, 0]
  ]],
  ["school", "🏫", [
    ["📖", "book", "das Buch", 1], ["✂️", "scissors", "die Schere", 1], ["🖊️", "pen", "der Stift", 1], ["🔔", "bell", "die Glocke", 1], ["🧩", "puzzle", "das Puzzle", 1], ["📓", "notebook", "das Heft", 1],
    ["🏫", "school", "die Schule", 1], ["🚌", "bus", "der Bus", 1], ["🥁", "drum", "die Trommel", 1], ["📏", "ruler", "das Lineal", 2], ["🗺️", "map", "Karte"], ["🌍", "globe", "der Globus", 2],
    ["🖌️", "brush", "Pinsel"], ["🎨", "paint", "Farbe"], ["🔢", "number", "Zahl"], ["🎈", "balloon", "Ballon"], ["🎹", "piano", "das Klavier", 2], ["🧴", "glue", "Kleber"],
    ["🖍️", "chalk", "Kreide"], ["📋", "board", "Tafel"], ["🪑", "desk", "Pult"], ["🧑‍🤝‍🧑", "class", "Klasse"], ["⏰", "break", "Pause"], ["🔤", "word", "Wort"],
    ["✉️", "letter", "Brief"], ["📝", "test", "Test"], ["🧽", "eraser", "Radierer"], ["🎒", "backpack", "Ranzen"], ["🍱", "lunch", "Brotdose"], ["🤝", "friend", "Freund"],
    ["🎵", "music", "Musik"], ["🏃", "gym", "Sport"], ["🎒", "backpack", "der Rucksack", 1, 0], ["💻", "computer", "der Computer", 1, 0], ["⚽", "ball", "der Ball", 1, 0], ["✏️", "pencil", "der Bleistift", 2, 0],
    ["🗺️", "map", "die Landkarte", 2, 0], ["📎", "paper clip", "die Büroklammer", 2, 0], ["🖌️", "paintbrush", "der Pinsel", 2, 0], ["🎨", "paints", "die Farben", 2, 0], ["🔢", "numbers", "die Zahlen", 2, 0], ["🎈", "balloon", "der Luftballon", 2, 0],
    ["📅", "calendar", "der Kalender", 2, 0], ["🎺", "trumpet", "die Trompete", 2, 0], ["🔬", "microscope", "das Mikroskop", 2, 0]
  ]],
  ["body", "🧍", [
    ["🙂", "head", "Kopf"], ["✋", "hand", "Hand"], ["🦶", "foot", "Fuß"], ["💪", "arm", "Arm"], ["🦵", "leg", "Bein"], ["👁️", "eye", "Auge"],
    ["👂", "ear", "Ohr"], ["👃", "nose", "Nase"], ["👄", "mouth", "Mund"], ["💇", "hair", "Haar"], ["🦷", "tooth", "Zahn"], ["🦵", "knee", "Knie"],
    ["☝️", "finger", "Finger"], ["🦶", "toe", "Zeh"], ["🔙", "back", "Rücken"], ["🫃", "belly", "Bauch"], ["🧣", "neck", "Hals"], ["❤️", "heart", "Herz"],
    ["🦴", "bone", "Knochen"], ["🧴", "skin", "Haut"], ["💋", "lip", "Lippe"], ["🧔", "chin", "Kinn"], ["💪", "elbow", "Ellbogen"], ["🧠", "brain", "Gehirn"],
    ["🩸", "blood", "Blut"], ["👍", "thumb", "Daumen"], ["😊", "cheek", "Wange"], ["👅", "tongue", "Zunge"], ["🫁", "lung", "Lunge"], ["💪", "muscle", "Muskel"]
  ]],
  ["nature", "🌳", [
    ["🌳", "tree", "Baum"], ["🌸", "flower", "Blume"], ["🏞️", "river", "Fluss"], ["⛰️", "mountain", "Berg"], ["🌲", "forest", "Wald"], ["🏞️", "lake", "See"],
    ["🌊", "sea", "Meer"], ["🪨", "stone", "Stein"], ["🌧️", "rain", "Regen"], ["❄️", "snow", "Schnee"], ["💨", "wind", "Wind"], ["☁️", "cloud", "Wolke"],
    ["🍃", "leaf", "Blatt"], ["🌿", "grass", "Gras"], ["⛰️", "hill", "Hügel"], ["🏖️", "beach", "Strand"], ["🏝️", "island", "Insel"], ["⏳", "sand", "Sand"],
    ["⛈️", "storm", "Sturm"], ["🧊", "ice", "Eis"], ["🔥", "fire", "Feuer"], ["🌫️", "fog", "Nebel"], ["🌱", "root", "Wurzel"], ["🌰", "seed", "Samen"],
    ["🌊", "wave", "Welle"], ["🏜️", "desert", "Wüste"], ["🕳️", "cave", "Höhle"], ["🏞️", "valley", "Tal"], ["🌋", "volcano", "Vulkan"], ["🌈", "rainbow", "Regenbogen"],
    ["🍂", "autumn", "Herbst"], ["🌷", "spring", "Frühling"], ["☀️", "summer", "Sommer"], ["⛄", "winter", "Winter"]
  ]],
  ["clothes", "👕", [
    ["👕", "shirt", "Hemd"], ["👗", "dress", "Kleid"], ["🎩", "hat", "Hut"], ["👟", "shoe", "Schuh"], ["🧦", "sock", "Socke"], ["🧥", "coat", "Mantel"],
    ["🧣", "scarf", "Schal"], ["🧤", "glove", "Handschuh"], ["👖", "belt", "Gürtel"], ["🥾", "boot", "Stiefel"], ["👚", "skirt", "Rock"], ["👖", "jeans", "Jeans"],
    ["🧢", "cap", "Mütze"], ["🧥", "jacket", "Jacke"], ["🔘", "button", "Knopf"], ["👜", "pocket", "Tasche"], ["🧶", "sweater", "Pullover"], ["👔", "tie", "Krawatte"],
    ["💍", "ring", "Ring"], ["⌚", "watch", "Armbanduhr"], ["👓", "glasses", "Brille"], ["👒", "bonnet", "Haube"], ["🩳", "shorts", "Shorts"], ["🩱", "swimsuit", "Badeanzug"],
    ["👠", "heel", "Absatz"], ["🧵", "thread", "Faden"], ["🪡", "needle", "Nadel"], ["🎽", "vest", "Weste"], ["🥻", "silk", "Seide"], ["🧶", "wool", "Wolle"]
  ]],
  ["colours", "🎨", [
    ["🔴", "red", "rot"], ["🔵", "blue", "blau"], ["🟢", "green", "grün"], ["🟡", "yellow", "gelb"], ["⚫", "black", "schwarz"], ["⚪", "white", "weiß"],
    ["🩷", "pink", "rosa"], ["🟤", "brown", "braun"], ["🩶", "grey", "grau"], ["🟠", "orange", "orange"], ["🟣", "purple", "lila"], ["🥇", "gold", "gold"],
    ["🥈", "silver", "silber"], ["🌑", "dark", "dunkel"], ["🌕", "light", "hell"], ["🌈", "bright", "bunt"], ["🩵", "pale", "blass"], ["🖤", "shade", "Schatten"],
    ["🖍️", "crayon", "Wachsmaler"], ["🎨", "colour", "Farbe"], ["🌈", "rainbow", "Regenbogen"], ["🟩", "lime", "limette"], ["🟦", "navy", "marine"], ["🟧", "amber", "bernstein"],
    ["🌸", "rose", "rosé"], ["🍑", "peach", "pfirsich"], ["🫒", "olive", "oliv"], ["🧡", "warm", "warm"], ["💙", "cold", "kalt"], ["🤍", "clean", "sauber"]
  ]],
  ["sport", "🏀", [
    ["⚽", "ball", "Ball"], ["🥅", "goal", "Tor"], ["🏃", "run", "Lauf"], ["🤸", "jump", "Sprung"], ["👥", "team", "Team"], ["🚲", "bike", "Rad"],
    ["🏁", "race", "Rennen"], ["🎾", "tennis", "Tennis"], ["🏅", "medal", "Medaille"], ["🏆", "win", "Sieg"], ["🥅", "net", "Netz"], ["🧑‍🏫", "coach", "Trainer"],
    ["🎿", "ski", "Ski"], ["🧗", "climb", "klettern"], ["💃", "dance", "Tanz"], ["🥋", "judo", "Judo"], ["⛳", "golf", "Golf"], ["🥊", "boxing", "Boxen"],
    ["🏒", "hockey", "Hockey"], ["🏄", "surf", "surfen"], ["🪢", "rope", "Seil"], ["🏆", "trophy", "Pokal"], ["⏱️", "sprint", "Sprint"], ["⛑️", "helmet", "Helm"],
    ["🏟️", "field", "Feld"], ["🔢", "points", "Punkte"], ["🚦", "start", "Start"], ["🏁", "finish", "Ziel"], ["🏊", "swim", "Schwimmen"], ["🏀", "basket", "Korb"],
    ["🛹", "skate", "Skaten"], ["🧘", "yoga", "Yoga"]
  ]],
  ["space", "🚀", [
    ["☀️", "sun", "Sonne"], ["🌙", "moon", "Mond"], ["⭐", "star", "Stern"], ["🪐", "planet", "Planet"], ["🚀", "rocket", "Rakete"], ["☄️", "comet", "Komet"],
    ["🌍", "earth", "Erde"], ["🔴", "mars", "Mars"], ["🔄", "orbit", "Bahn"], ["🌌", "galaxy", "Galaxie"], ["👽", "alien", "Alien"], ["🪐", "saturn", "Saturn"],
    ["🟠", "venus", "Venus"], ["🟤", "jupiter", "Jupiter"], ["🕳️", "crater", "Krater"], ["💡", "light", "Licht"], ["🌌", "space", "Weltall"], ["☄️", "meteor", "Meteor"],
    ["🌫️", "dust", "Staub"], ["💍", "ring", "Ring"], ["🛰️", "probe", "Sonde"], ["🧑‍🚀", "crew", "Crew"], ["🌑", "shadow", "Schatten"], ["🔭", "lens", "Linse"],
    ["🌠", "shooting", "Sternschnuppe"], ["🌞", "solar", "solar"], ["🌗", "phase", "Phase"], ["🛸", "ufo", "Ufo"], ["🌍", "globe", "Kugel"], ["🧭", "north", "Norden"],
    ["🌡️", "heat", "Hitze"], ["🧊", "cold", "Kälte"]
  ]],
  ["jobs", "👩‍🚒", [
    ["🧑‍⚕️", "doctor", "Arzt"], ["🧑‍🍳", "baker", "Bäcker"], ["🧑‍✈️", "pilot", "Pilot"], ["🧑‍🌾", "farmer", "Bauer"], ["🧑‍🏫", "teacher", "Lehrer"], ["🧑‍⚕️", "nurse", "Pfleger"],
    ["🧑‍🍳", "cook", "Koch"], ["🧑‍🎨", "artist", "Maler"], ["🧑‍⚖️", "judge", "Richter"], ["👮", "police", "Polizei"], ["🐾", "vet", "Tierarzt"], ["🦷", "dentist", "Zahnarzt"],
    ["🚗", "driver", "Fahrer"], ["🎤", "singer", "Sänger"], ["✍️", "writer", "Autor"], ["🤡", "clown", "Clown"], ["👑", "king", "König"], ["👸", "queen", "Königin"],
    ["🛡️", "knight", "Ritter"], ["⚓", "captain", "Kapitän"], ["🧱", "builder", "Maurer"], ["⛏️", "miner", "Bergmann"], ["⛵", "sailor", "Matrose"], ["💂", "guard", "Wächter"],
    ["🧑‍🚒", "fireman", "Feuerwehr"], ["💇", "barber", "Friseur"], ["🧑‍🔬", "chemist", "Chemiker"], ["🧑‍💻", "coder", "Coder"], ["🧑‍🔧", "mechanic", "Mechaniker"], ["📸", "photo", "Fotograf"],
    ["🧑‍🎤", "dancer", "Tänzer"], ["🧑‍🚀", "pilot", "Astronaut"], ["🧑‍🌾", "gardener", "Gärtner"], ["🏪", "seller", "Verkäufer"]
  ]],
  ["town", "🏙️", [
    ["🛣️", "street", "Straße"], ["🏪", "shop", "Laden"], ["🌳", "park", "Park"], ["🌉", "bridge", "Brücke"], ["🚉", "station", "Bahnhof"], ["🧺", "market", "Markt"],
    ["⛪", "church", "Kirche"], ["🗼", "tower", "Turm"], ["🏛️", "museum", "Museum"], ["🏦", "bank", "Bank"], ["🥖", "bakery", "Bäckerei"], ["🏨", "hotel", "Hotel"],
    ["🎬", "cinema", "Kino"], ["📚", "library", "Bücherei"], ["⚓", "harbour", "Hafen"], ["🏰", "castle", "Burg"], ["🦁", "zoo", "Zoo"], ["🏥", "hospital", "Klinik"],
    ["🚦", "traffic", "Verkehr"], ["🚋", "tram", "Tram"], ["🚕", "taxi", "Taxi"], ["🏙️", "square", "Platz"], ["⛲", "fountain", "Brunnen"], ["↪️", "corner", "Ecke"],
    ["🪧", "sign", "Schild"], ["🚗", "garage", "Garage"], ["🚇", "tunnel", "Tunnel"], ["🏙️", "city", "Stadt"], ["🏘️", "village", "Dorf"], ["🛤️", "road", "Weg"],
    ["📮", "mail", "Post"], ["🏊", "pool", "Freibad"], ["🚏", "stop", "Halt"], ["🛒", "cart", "Wagen"]
  ]],
  ["feelings", "😀", [
    ["😀", "happy", "froh"], ["😢", "sad", "traurig"], ["😠", "angry", "wütend"], ["😌", "proud", "stolz"], ["🦁", "brave", "mutig"], ["😳", "shy", "scheu"],
    ["😇", "calm", "ruhig"], ["🥱", "tired", "müde"], ["😱", "scared", "bang"], ["🤪", "silly", "albern"], ["🤗", "kind", "nett"], ["😂", "funny", "lustig"],
    ["😔", "lonely", "einsam"], ["😊", "glad", "heiter"], ["😤", "grumpy", "mürrisch"], ["😬", "nervous", "nervös"], ["😁", "cheerful", "fröhlich"], ["🤤", "hungry", "hungrig"],
    ["🥤", "thirsty", "durstig"], ["🥰", "nice", "lieb"], ["😎", "cool", "cool"], ["😮", "amazed", "staunend"], ["🤒", "sick", "krank"], ["😴", "sleepy", "dösig"],
    ["🤩", "wow", "toll"], ["🙃", "upset", "sauer"], ["💪", "strong", "stark"], ["🥺", "sorry", "leid"], ["😌", "relaxed", "entspannt"], ["🥳", "merry", "munter"]
  ]],
  ["science", "🔬", [
    ["⚡", "energy", "Energie"], ["🧲", "magnet", "Magnet"], ["⚛️", "atom", "Atom"], ["🦠", "cell", "Zelle"], ["🌡️", "climate", "Klima"], ["🦴", "fossil", "Fossil"],
    ["🔋", "battery", "Batterie"], ["🔌", "current", "Strom"], ["🔩", "metal", "Metall"], ["♨️", "steam", "Dampf"], ["🔊", "sound", "Schall"], ["🔥", "heat", "Hitze"],
    ["💪", "force", "Kraft"], ["⚙️", "motor", "Motor"], ["🧪", "molecule", "Molekül"], ["🧪", "acid", "Säure"], ["🌱", "plant", "Pflanze"], ["🐞", "insect", "Insekt"],
    ["💎", "mineral", "Mineral"], ["💎", "crystal", "Kristall"], ["⚫", "carbon", "Kohle"], ["🔦", "laser", "Laser"], ["🤖", "robot", "Roboter"], ["🦠", "microbe", "Keim"],
    ["🦠", "virus", "Virus"], ["💨", "gas", "Gas"], ["🧊", "solid", "fest"], ["💧", "liquid", "Wasser"], ["🧠", "nerve", "Nerv"], ["🔬", "lens", "Linse"],
    ["🌍", "gravity", "Schwerkraft"], ["🧬", "gene", "Gen"], ["🪨", "rock", "Gestein"], ["🧫", "sample", "Probe"]
  ]],
  ["verbs", "🏃", [
    ["🏃", "run", "laufen"], ["🤸", "jump", "springen"], ["🏊", "swim", "schwimmen"], ["🎤", "sing", "singen"], ["📖", "read", "lesen"], ["✍️", "write", "schreiben"],
    ["🍽️", "eat", "essen"], ["🥤", "drink", "trinken"], ["😴", "sleep", "schlafen"], ["🎲", "play", "spielen"], ["💃", "dance", "tanzen"], ["🧗", "climb", "klettern"],
    ["🎨", "paint", "malen"], ["🍳", "cook", "kochen"], ["😂", "laugh", "lachen"], ["😢", "cry", "weinen"], ["🪁", "fly", "fliegen"], ["🪑", "sit", "sitzen"],
    ["🎁", "give", "geben"], ["🤔", "think", "denken"], ["👂", "hear", "hören"], ["👀", "see", "sehen"], ["🚪", "open", "öffnen"], ["🏗️", "build", "bauen"],
    ["🎓", "learn", "lernen"], ["🤝", "help", "helfen"], ["🚶", "walk", "gehen"], ["🥎", "throw", "werfen"], ["🧤", "catch", "fangen"], ["👉", "push", "drücken"],
    ["👈", "pull", "ziehen"], ["🧹", "clean", "putzen"], ["🛒", "buy", "kaufen"], ["🔍", "find", "finden"]
  ]]
];
