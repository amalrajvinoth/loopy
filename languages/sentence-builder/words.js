/* loopy: the sentences for Sentence Builder.
   Per language, four lists by length. Each entry: the words of one sentence in the right order.
   Edit this file, then run python3 tools/build.py so the offline copy learns about the change. */
// Each sentence: "picture words...". A * marks the verb (for the hint "the verb comes second").
// Four levels: 3 words with the full stop on the last word; 4 to 5 words, the full stop as its own
// tile; 6 words with questions; 7 to 8 words with a comma. English and German are written separately,
// so each has its natural word order.
const SENTENCES = {
  en: [
    ["🐶 The dog *sleeps.", "🐱 The cat *purrs.", "🐦 The bird *sings.", "🐸 The frog *jumps.", "🐟 The fish *swims.", "👶 The baby *laughs.",
     "☀️ The sun *shines.", "🌧️ The rain *falls.", "🐄 The cow *moos.", "🐝 The bee *buzzes.", "🚌 The bus *stops.", "🔔 The bell *rings.",
     "🐴 The horse *runs.", "👧 My sister *reads.", "👦 My brother *draws.", "👩 My mum *cooks.", "👨 My dad *sings.", "🐑 The sheep *eats.",
     "🦆 The duck *quacks.", "🐷 The pig *rolls.", "🌳 The tree *grows.", "🐭 The mouse *hides.", "🦁 The lion *roars.", "🐔 The hen *clucks.",
     "🏫 School *starts today.", "⭐ Stars *shine brightly.", "🚂 The train *waits.", "🐢 The turtle *crawls.", "🌙 The moon *glows.", "🧸 My teddy *smiles."],
    ["🐱 The cat *drinks milk.", "🐶 The dog *likes bones.", "🍎 I *eat an apple.", "⚽ We *play football.", "🐦 Birds *fly high.", "📚 Tom *reads a book.",
     "🛏️ The baby *sleeps now.", "🌧️ It *rains today.", "🍦 I *love ice cream.", "🏫 We *go to school.", "🐸 The frog *is green.", "🚗 Dad *drives the car.",
     "🍪 Mum *bakes cookies.", "🎒 My bag *is heavy.", "☀️ The sun *is hot.", "🐟 Fish *swim in water.", "🐴 The horse *eats hay.", "🎈 The balloon *is red.",
     "🐱 Cats *like warm beds.", "🌸 Flowers *smell nice.", "🧦 My socks *are blue.", "🐝 Bees *make honey.", "🚌 The bus *is late.", "🍌 Monkeys *love bananas.",
     "❄️ Snow *is cold.", "🎉 Happy birthday to you!", "🐘 Elephants *are big.", "🧹 We *clean the room.", "🎵 Anna *sings a song.", "🌈 Look at the rainbow!"],
    ["⚽ Where is my red ball?", "🐶 Where does the dog sleep?", "🍎 Do you like green apples?", "🏫 What time does school start?", "🐱 My cat *sleeps all day.",
     "🎂 How old are you today?", "🐸 Frogs *jump into the pond.", "🚌 The bus *comes at eight.", "🍕 Can we eat pizza tonight?", "🌧️ It *rains a lot today.",
     "🐦 The little bird *sings loudly.", "📚 Who reads the big book?", "🎈 My balloon *is bright red.", "🐴 Why is the horse sad?", "🏠 We *live in a house.",
     "🌙 The moon *shines at night.", "🍪 Mum *bakes cookies on Sunday.", "🐟 Which fish is the biggest?", "🧸 My teddy *has a hat.", "🚂 When does the train leave?",
     "🌳 The old tree *is tall.", "🐝 Busy bees *make sweet honey.", "🎒 Is this your school bag?", "❄️ Snow *falls in the winter.", "🍌 Monkeys *eat bananas every day.",
     "🐘 Elephants *have very big ears.", "🎵 Can you sing this song?", "🏖️ We *build a sand castle.", "🐭 Where does the mouse hide?", "🌈 Look at the pretty rainbow!"],
    ["🌧️ When it rains, we *play inside.", "☀️ When the sun shines, we *go outside.", "🍎 After lunch, I *eat an apple.", "🐶 If the dog barks, the cat *runs.",
     "🏫 On Monday, we *go to school.", "🛏️ At night, the baby *sleeps well.", "🎂 On my birthday, I *get a cake.", "❄️ When it snows, we *build a snowman.",
     "🐱 If you are quiet, the cat *comes.", "🍪 After school, Mum *bakes cookies.", "🌙 When the moon rises, the owls *wake.", "🚌 If the bus is late, we *walk.",
     "🎒 Before school, I *pack my bag.", "🐸 In spring, the frogs *sing all night.", "🍕 On Fridays, we *eat pizza together.", "🌳 In autumn, the leaves *fall down.",
     "🐦 Every morning, the birds *sing loudly.", "🏖️ In summer, we *swim in the sea.", "🧸 If I am tired, I *sleep early.", "🐴 In the field, the horse *runs fast.",
     "🎵 After dinner, we *sing a song.", "🚂 When the train stops, we *get off.", "🐟 In the pond, the fish *swim quickly.", "🌈 After the rain, a rainbow *appears.",
     "🍌 At the zoo, the monkeys *eat bananas.", "🧹 On Saturday, we *clean our room.", "🐝 In the garden, the bees *are busy.", "🎈 At the party, we *had red balloons.",
     "🐘 At the zoo, the elephant *sprays water.", "📚 Before bed, Dad *reads a story."]
  ],
  de: [
    ["🐶 Der Hund *schläft.", "🐱 Die Katze *schnurrt.", "🐦 Der Vogel *singt.", "🐸 Der Frosch *hüpft.", "🐟 Der Fisch *schwimmt.", "👶 Das Baby *lacht.",
     "☀️ Die Sonne *scheint.", "🌧️ Der Regen *fällt.", "🐄 Die Kuh *muht.", "🐝 Die Biene *summt.", "🚌 Der Bus *hält.", "🔔 Die Glocke *läutet.",
     "🐴 Das Pferd *rennt.", "👧 Meine Schwester *liest.", "👦 Mein Bruder *malt.", "👩 Mama *kocht Suppe.", "👨 Papa *singt laut.", "🐑 Das Schaf *frisst.",
     "🦆 Die Ente *schnattert.", "🐷 Das Schwein *grunzt.", "🌳 Der Baum *wächst.", "🐭 Die Maus *piept.", "🦁 Der Löwe *brüllt.", "🐔 Das Huhn *gackert.",
     "🏫 Die Schule *beginnt.", "⭐ Sterne *leuchten hell.", "🚂 Der Zug *wartet.", "🐢 Die Schildkröte *kriecht.", "🌙 Der Mond *leuchtet.", "🧸 Mein Teddy *lächelt."],
    ["🐱 Die Katze *trinkt Milch.", "🐶 Der Hund *mag Knochen.", "🍎 Ich *esse einen Apfel.", "⚽ Wir *spielen Fußball.", "🐦 Vögel *fliegen hoch.", "📚 Tom *liest ein Buch.",
     "🛏️ Das Baby *schläft jetzt.", "🌧️ Heute *regnet es.", "🍦 Ich *liebe Eis.", "🏫 Wir *gehen zur Schule.", "🐸 Der Frosch *ist grün.", "🚗 Papa *fährt das Auto.",
     "🍪 Mama *backt Kekse.", "🎒 Mein Ranzen *ist schwer.", "☀️ Die Sonne *ist heiß.", "🐟 Fische *schwimmen im Wasser.", "🐴 Das Pferd *frisst Heu.", "🎈 Der Ballon *ist rot.",
     "🐱 Katzen *mögen warme Betten.", "🌸 Blumen *duften gut.", "🧦 Meine Socken *sind blau.", "🐝 Bienen *machen Honig.", "🚌 Der Bus *kommt spät.", "🍌 Affen *lieben Bananen.",
     "❄️ Schnee *ist kalt.", "🎉 Alles Gute zum Geburtstag!", "🐘 Elefanten *sind groß.", "🧹 Wir *putzen das Zimmer.", "🎵 Anna *singt ein Lied.", "🌈 Schau den Regenbogen an!"],
    ["⚽ Wo ist mein roter Ball?", "🐶 Wo schläft der kleine Hund?", "🍎 Isst du gern grüne Äpfel?", "🏫 Wann beginnt die Schule heute?", "🐱 Die Katze *schläft im Bett.",
     "🎂 Wie alt bist du heute?", "🐸 Frösche *springen in den Teich.", "🚌 Der Bus *kommt um acht.", "🍕 Essen wir heute Abend Pizza?", "🌧️ Heute *regnet es sehr viel.",
     "🐦 Der kleine Vogel *singt laut.", "📚 Wer liest das dicke Buch?", "🎈 Mein Ballon *ist ganz rot.", "🐴 Warum ist das Pferd traurig?", "🏠 Wir *wohnen in einem Haus.",
     "🌙 Der Mond *scheint nachts hell.", "🍪 Mama *backt am Sonntag Kekse.", "🐟 Welcher Fisch ist am größten?", "🧸 Mein Teddy *hat einen Hut.", "🚂 Wann fährt der Zug ab?",
     "🌳 Der alte Baum *ist hoch.", "🐝 Fleißige Bienen *machen süßen Honig.", "🎒 Ist das hier dein Ranzen?", "❄️ Im Winter *fällt viel Schnee.", "🍌 Affen *essen jeden Tag Bananen.",
     "🐘 Elefanten *haben sehr große Ohren.", "🎵 Kannst du dieses Lied singen?", "🏖️ Wir *bauen eine große Sandburg.", "🐭 Wo versteckt sich die Maus?", "🌈 Sieh den bunten Regenbogen an!"],
    ["🌧️ Wenn es regnet, *spielen wir drinnen.", "☀️ Wenn die Sonne scheint, *gehen wir raus.", "🍞 Wenn ich Hunger habe, *esse ich Brot.", "🐶 Wenn der Hund bellt, *rennt die Katze.",
     "🛏️ Wenn es dunkel wird, *gehe ich schlafen.", "🎂 Wenn ich Geburtstag habe, *gibt es Kuchen.", "❄️ Wenn es schneit, *bauen wir einen Schneemann.", "🐱 Wenn du leise bist, *kommt die Katze.",
     "🍪 Mama *backt Kekse, und wir helfen.", "🌙 Wenn der Mond scheint, *schlafen wir.", "🚌 Wenn der Bus fehlt, *laufen wir.", "🎒 Ich *packe die Tasche, bevor ich gehe.",
     "🐸 Frösche *singen laut, wenn es warm ist.", "🍕 Wenn Freitag ist, *essen wir Pizza.", "🌳 Wenn es Herbst wird, *fallen die Blätter.", "🐦 Die Vögel *singen, bevor ich aufstehe.",
     "🏖️ Wenn Sommer ist, *schwimmen wir im Meer.", "🧸 Wenn ich müde bin, *schlafe ich früh.", "🐴 Das Pferd *rennt, wenn es sich freut.", "🎵 Wir *singen ein Lied, und Papa lacht.",
     "🚂 Wenn der Zug hält, *steigen wir aus.", "🐟 Die Fische *schwimmen schnell, wenn ich komme.", "🌈 Wenn der Regen aufhört, *kommt der Regenbogen.", "🍌 Die Affen *essen Bananen, und wir lachen.",
     "🧹 Am Samstag *putzen wir, dann spielen wir.", "🐝 Die Bienen *summen, weil die Blumen blühen.", "🎈 Ich *mag Ballons, aber Lea mag Kuchen.", "🐘 Der Elefant *spritzt Wasser, und alle lachen.",
     "📚 Papa *liest vor, bevor ich schlafe.", "🍎 Ich *esse Äpfel, weil sie süß sind."]
  ]
};
