/* loopy: the countries, capitals and flag drawings for Flags and Capitals.
   Each flag: [code, region, level, English name, German name, English capital, German capital, drawing]. The drawing steps are explained below.
   Edit this file, then run python3 tools/build.py so the offline copy learns about the change. */
// Each flag: [code, region, level, English name, German name, English capital, German capital, drawing].
// Level 1 is the well-known flags for younger children, level 2 the rest.
// Region "oc" (Australia and New Zealand) only comes up in World.
// The drawing is on a 30 × 20 grid (20 × 20 after "w 20"). Steps are split by ";":
//   h / v colors...      equal stripes, across or down
//   r x y w h color      box          c x y r color      circle        e x y rx ry color   oval
//   o x y r color width  ring         l x1 y1 x2 y2 color width        line
//   p x,y x,y ... color  shape        s x y r color [turn] [points] [inner]   star (point up)
//   S x y r color width  star drawn as lines (Morocco, Ethiopia)
//   g x y dx dy nx ny r color   a grid of dots (the US stars)
//   u x y w h            the Union Jack in that box
// Colors: a letter from PAL or a #hex color. Flags keep their real colors in every theme.
const PAL = { W: "#ffffff", K: "#000000", R: "#c8102e", B: "#012169" };
const UNION = "r 0 0 30 20 B;l 0 0 30 20 W 4;l 30 0 0 20 W 4;l 0 0 30 20 R 1.3;l 30 0 0 20 R 1.3;r 12 0 6 20 W;r 0 7 30 6 W;r 13.2 0 3.6 20 R;r 0 8.2 30 3.6 R";
const LEAF = "15,4.4 16.1,6.5 17.3,6 16.8,8.6 18.6,7.1 19,8 20.4,7.6 19.8,9.4 20.6,9.9 17.9,12.2 18.2,13.1 15.35,12.7 15.45,15.4 14.55,15.4 14.65,12.7 11.8,13.1 12.1,12.2 9.4,9.9 10.2,9.4 9.6,7.6 11,8 11.4,7.1 13.2,8.6 12.7,6 13.9,6.5";
const NORDIC = (bg, cross, inner) => "r 0 0 30 20 " + bg + ";r 8.2 0 5.45 20 " + cross + ";r 0 7.5 30 5 " + cross + (inner ? ";r 9.55 0 2.73 20 " + inner + ";r 0 8.75 30 2.5 " + inner : "");
const MK_RAY = "p 15,10 13.4,0 16.6,0 #ffe600;p 15,10 13.4,20 16.6,20 #ffe600;p 15,10 0,8.4 0,11.6 #ffe600;p 15,10 30,8.4 30,11.6 #ffe600;p 15,10 0,1.8 0,0 2.7,0 #ffe600;p 15,10 30,1.8 30,0 27.3,0 #ffe600;p 15,10 0,18.2 0,20 2.7,20 #ffe600;p 15,10 30,18.2 30,20 27.3,20 #ffe600";
const FLAGS = [
  ["DEU", "eu", 1, "Germany", "Deutschland", "Berlin", "Berlin", "h K #dd0000 #ffce00"],
  ["FRA", "eu", 1, "France", "Frankreich", "Paris", "Paris", "v #002395 W #ed2939"],
  ["ITA", "eu", 1, "Italy", "Italien", "Rome", "Rom", "v #009246 W #ce2b37"],
  ["ESP", "eu", 1, "Spain", "Spanien", "Madrid", "Madrid", "h #aa151b #f1bf00 #f1bf00 #aa151b"],
  ["GBR", "eu", 1, "United Kingdom", "Vereinigtes Königreich", "London", "London", "u 0 0 30 20"],
  ["NLD", "eu", 1, "Netherlands", "Niederlande", "Amsterdam", "Amsterdam", "h #ae1c28 W #21468b"],
  ["BEL", "eu", 1, "Belgium", "Belgien", "Brussels", "Brüssel", "v K #fdda24 #ef3340"],
  ["CHE", "eu", 1, "Switzerland", "Schweiz", "Bern", "Bern", "w 20;r 0 0 20 20 #da291c;r 8.1 3.75 3.8 12.5 W;r 3.75 8.1 12.5 3.8 W"],
  ["AUT", "eu", 1, "Austria", "Österreich", "Vienna", "Wien", "h #ed2939 W #ed2939"],
  ["POL", "eu", 1, "Poland", "Polen", "Warsaw", "Warschau", "h W #dc143c"],
  ["DNK", "eu", 1, "Denmark", "Dänemark", "Copenhagen", "Kopenhagen", "r 0 0 30 20 R;r 9.7 0 3.2 20 W;r 0 8.57 30 2.86 W"],
  ["SWE", "eu", 1, "Sweden", "Schweden", "Stockholm", "Stockholm", "r 0 0 30 20 #006aa7;r 9.4 0 3.75 20 #fecc00;r 0 8 30 4 #fecc00"],
  ["NOR", "eu", 2, "Norway", "Norwegen", "Oslo", "Oslo", NORDIC("#ba0c2f", "W", "#00205b")],
  ["ISL", "eu", 2, "Iceland", "Island", "Reykjavík", "Reykjavík", NORDIC("#02529c", "W", "#dc1e35")],
  ["FIN", "eu", 2, "Finland", "Finnland", "Helsinki", "Helsinki", "r 0 0 30 20 W;r 8.33 0 5 20 #002f6c;r 0 7.27 30 5.45 #002f6c"],
  ["IRL", "eu", 2, "Ireland", "Irland", "Dublin", "Dublin", "v #169b62 W #ff883e"],
  ["PRT", "eu", 2, "Portugal", "Portugal", "Lisbon", "Lissabon", "r 0 0 30 20 #da291c;r 0 0 12 20 #046a38;c 12 10 4.4 #ffe900;c 12 10 3.5 #da291c;r 10.5 7.6 3 3.9 W;c 12 9.1 0.55 #002f6c;c 12 10.5 0.55 #002f6c"],
  ["GRC", "eu", 2, "Greece", "Griechenland", "Athens", "Athen", "h #0d5eaf W #0d5eaf W #0d5eaf W #0d5eaf W #0d5eaf;r 0 0 11.11 11.11 #0d5eaf;r 4.44 0 2.22 11.11 W;r 0 4.44 11.11 2.22 W"],
  ["TUR", "eu", 2, "Turkey", "Türkei", "Ankara", "Ankara", "r 0 0 30 20 #e30a17;c 10.6 10 5 W;c 11.85 10 4 #e30a17;s 16.4 10 2.5 W -90"],
  ["UKR", "eu", 2, "Ukraine", "Ukraine", "Kyiv", "Kiew", "h #0057b7 #ffd700"],
  ["CZE", "eu", 2, "Czechia", "Tschechien", "Prague", "Prag", "h W #d7141a;p 0,0 15,10 0,20 #11457e"],
  ["HUN", "eu", 2, "Hungary", "Ungarn", "Budapest", "Budapest", "h #ce2939 W #477050"],
  ["ROU", "eu", 2, "Romania", "Rumänien", "Bucharest", "Bukarest", "v #002b7f #fcd116 #ce1126"],
  ["BGR", "eu", 2, "Bulgaria", "Bulgarien", "Sofia", "Sofia", "h W #00966e #d62612"],
  ["EST", "eu", 2, "Estonia", "Estland", "Tallinn", "Tallinn", "h #0072ce K W"],
  ["LVA", "eu", 2, "Latvia", "Lettland", "Riga", "Riga", "r 0 0 30 20 #9e3039;r 0 8 30 4 W"],
  ["LTU", "eu", 2, "Lithuania", "Litauen", "Vilnius", "Vilnius", "h #fdb913 #006a44 #c1272d"],
  ["LUX", "eu", 2, "Luxembourg", "Luxemburg", "Luxembourg", "Luxemburg", "h #ed2939 W #00a1de"],
  ["MKD", "eu", 2, "North Macedonia", "Nordmazedonien", "Skopje", "Skopje", "r 0 0 30 20 #d20000;" + MK_RAY + ";c 15 10 3.7 #d20000;c 15 10 3 #ffe600"],
  ["USA", "am", 1, "United States", "Vereinigte Staaten", "Washington, D.C.", "Washington, D.C.", "h #b22234 W #b22234 W #b22234 W #b22234 W #b22234 W #b22234 W #b22234;r 0 0 12 10.77 #3c3b6e;g 1 0.95 2 2.2 6 5 0.42 W;g 2 2.05 2 2.2 5 4 0.42 W"],
  ["CAN", "am", 1, "Canada", "Kanada", "Ottawa", "Ottawa", "r 0 0 30 20 W;r 0 0 7.5 20 #d80621;r 22.5 0 7.5 20 #d80621;p " + LEAF + " #d80621"],
  ["MEX", "am", 1, "Mexico", "Mexiko", "Mexico City", "Mexiko-Stadt", "v #006847 W #ce1126;e 15 11.4 2.9 1.4 #2e7d32;c 15 9.7 2.2 #9c5b2b"],
  ["BRA", "am", 1, "Brazil", "Brasilien", "Brasília", "Brasília", "r 0 0 30 20 #009c3b;p 15,1.7 28.3,10 15,18.3 1.7,10 #ffdf00;c 15 10 5 #002776;l 10.2 8.6 19.9 10.9 W 0.8"],
  ["ARG", "am", 1, "Argentina", "Argentinien", "Buenos Aires", "Buenos Aires", "h #74acdf W #74acdf;s 15 10 2.8 #f6b40e 0 16 0.62;c 15 10 1.6 #f6b40e"],
  ["CHL", "am", 2, "Chile", "Chile", "Santiago", "Santiago", "r 0 0 30 20 W;r 0 10 30 10 #d52b1e;r 0 0 10 10 #0039a6;s 5 5 2.1 W"],
  ["COL", "am", 2, "Colombia", "Kolumbien", "Bogotá", "Bogotá", "r 0 0 30 10 #fcd116;r 0 10 30 5 #003893;r 0 15 30 5 #ce1126"],
  ["PER", "am", 2, "Peru", "Peru", "Lima", "Lima", "v #d91023 W #d91023"],
  ["JAM", "am", 2, "Jamaica", "Jamaika", "Kingston", "Kingston", "r 0 0 30 20 #009b3a;p 0,0 15,10 0,20 K;p 30,0 15,10 30,20 K;l -2 -1.33 32 21.33 #fed100 2.6;l 32 -1.33 -2 21.33 #fed100 2.6"],
  ["CUB", "am", 2, "Cuba", "Kuba", "Havana", "Havanna", "h #002a8f W #002a8f W #002a8f;p 0,0 13,10 0,20 #cf142b;s 4.4 10 2.3 W"],
  ["JPN", "as", 1, "Japan", "Japan", "Tokyo", "Tokio", "r 0 0 30 20 W;c 15 10 6 #bc002d"],
  ["CHN", "as", 1, "China", "China", "Beijing", "Peking", "r 0 0 30 20 #ee1c25;s 5 5 3 #ffde00;s 10 2 1 #ffde00 239;s 12 4 1 #ffde00 262;s 12 7 1 #ffde00 286;s 10 9 1 #ffde00 309"],
  ["IND", "as", 1, "India", "Indien", "New Delhi", "Neu-Delhi", "h #ff9933 W #138808;o 15 10 2.6 #000080 0.45;c 15 10 0.6 #000080"],
  ["THA", "as", 2, "Thailand", "Thailand", "Bangkok", "Bangkok", "h #a51931 W #2d2a4a #2d2a4a W #a51931"],
  ["VNM", "as", 2, "Vietnam", "Vietnam", "Hanoi", "Hanoi", "r 0 0 30 20 #da251d;s 15 10 6 #ffff00"],
  ["IDN", "as", 2, "Indonesia", "Indonesien", "Jakarta", "Jakarta", "h #ce1126 W"],
  ["PHL", "as", 2, "Philippines", "Philippinen", "Manila", "Manila", "r 0 0 30 10 #0038a8;r 0 10 30 10 #ce1126;p 0,0 17.32,10 0,20 W;s 5.8 10 2.6 #fcd116 0 8 0.45;c 5.8 10 1.3 #fcd116;s 1.8 2.8 0.8 #fcd116 90;s 1.8 17.2 0.8 #fcd116 90;s 14.3 10 0.8 #fcd116 90"],
  ["PAK", "as", 2, "Pakistan", "Pakistan", "Islamabad", "Islamabad", "r 0 0 30 20 #01411c;r 0 0 7.5 20 W;c 19 10.5 5.4 W;c 20.4 9.1 4.9 #01411c;s 21.6 7.8 1.6 W 40"],
  ["BGD", "as", 2, "Bangladesh", "Bangladesch", "Dhaka", "Dhaka", "r 0 0 30 20 #006a4e;c 13.5 10 6 #f42a41"],
  ["ARE", "as", 2, "United Arab Emirates", "Vereinigte Arabische Emirate", "Abu Dhabi", "Abu Dhabi", "h #00732f W K;r 0 0 7.5 20 #ff0000"],
  ["SGP", "as", 2, "Singapore", "Singapur", "", "", "h #ef3340 W;c 6.2 5 3.5 W;c 7.5 5 3.4 #ef3340;s 9.3 3.3 0.55 W;s 10.92 4.47 0.55 W;s 10.3 6.38 0.55 W;s 8.3 6.38 0.55 W;s 7.68 4.47 0.55 W"],
  ["EGY", "af", 1, "Egypt", "Ägypten", "Cairo", "Kairo", "h #ce1126 W K;p 15,7.4 16.5,8.6 16.2,12.2 13.8,12.2 13.5,8.6 #c09300"],
  ["NGA", "af", 1, "Nigeria", "Nigeria", "Abuja", "Abuja", "v #008751 W #008751"],
  ["ZAF", "af", 1, "South Africa", "Südafrika", "", "", "r 0 0 30 10 #e03c31;r 0 10 30 10 #001489;l -2 -1.5 13 10 W 6.67;l -2 21.5 13 10 W 6.67;r 12 6.67 18 6.66 W;l -2 -1.5 13 10 #007749 4;l -2 21.5 13 10 #007749 4;r 12 8 18 4 #007749;p 0,2.6 9.6,10 0,17.4 #ffb81c;p 0,4.4 7.2,10 0,15.6 K"],
  ["GHA", "af", 1, "Ghana", "Ghana", "Accra", "Accra", "h #ce1126 #fcd116 #006b3f;s 15 10 3.2 K"],
  ["MAR", "af", 1, "Morocco", "Marokko", "Rabat", "Rabat", "r 0 0 30 20 #c1272d;S 15 10.4 4.2 #006233 0.7"],
  ["KEN", "af", 2, "Kenya", "Kenia", "Nairobi", "Nairobi", "r 0 0 30 20 W;r 0 0 30 6 K;r 0 7 30 6 #bb0000;r 0 14 30 6 #006600;l 10.5 3 19.5 17 W 0.6;l 19.5 3 10.5 17 W 0.6;e 15 10 3.2 6.6 K;e 15 10 2 6.4 #bb0000;e 15 10 0.5 1.6 W"],
  ["ETH", "af", 2, "Ethiopia", "Äthiopien", "Addis Ababa", "Addis Abeba", "h #078930 #fcdd09 #da121a;c 15 10 4.6 #0f47af;S 15 10.3 3.2 #fcdd09 0.6"],
  ["TZA", "af", 2, "Tanzania", "Tansania", "Dodoma", "Dodoma", "r 0 0 30 20 #1eb53a;p 30,0 30,20 0,20 #00a3dd;l -3 22 33 -2 #fcd116 7;l -3 22 33 -2 K 4.8"],
  ["SEN", "af", 2, "Senegal", "Senegal", "Dakar", "Dakar", "v #00853f #fdef42 #e31b23;s 15 10 2.8 #00853f"],
  ["MLI", "af", 2, "Mali", "Mali", "Bamako", "Bamako", "v #14b53a #fcd116 #ce1126"],
  ["CMR", "af", 2, "Cameroon", "Kamerun", "Yaoundé", "Jaunde", "v #007a5e #ce1126 #fcd116;s 15 10 2.6 #fcd116"],
  ["SOM", "af", 2, "Somalia", "Somalia", "Mogadishu", "Mogadischu", "r 0 0 30 20 #4189dd;s 15 10 5 W"],
  ["TUN", "af", 2, "Tunisia", "Tunesien", "Tunis", "Tunis", "r 0 0 30 20 #e70013;c 15 10 5 W;c 14.2 10 3.7 #e70013;c 15.2 10 3.05 W;s 16.3 10 2.2 #e70013 -90"],
  ["BWA", "af", 2, "Botswana", "Botswana", "Gaborone", "Gaborone", "r 0 0 30 20 #75aadb;r 0 7.9 30 4.2 W;r 0 8.75 30 2.5 K"],
  ["AUS", "oc", 1, "Australia", "Australien", "Canberra", "Canberra", "r 0 0 30 20 B;u 0 0 15 10;s 7.5 15 2.4 W 0 7 0.47;s 22.5 16.7 1.2 W 0 7 0.47;s 18.4 8.6 1.2 W 0 7 0.47;s 22.5 3.4 1.2 W 0 7 0.47;s 26.1 7.5 1.2 W 0 7 0.47;s 24.3 10.3 0.6 W"],
  ["NZL", "oc", 2, "New Zealand", "Neuseeland", "Wellington", "Wellington", "r 0 0 30 20 B;u 0 0 15 10;s 22.5 16.5 1.4 W;s 22.5 16.5 1 R;s 22.5 4.5 1.25 W;s 22.5 4.5 0.88 R;s 19.4 9 1.2 W;s 19.4 9 0.84 R;s 25.6 8 1.1 W;s 25.6 8 0.74 R"]
].map(f => ({ code: f[0], region: f[1], level: f[2], en: { name: f[3], cap: f[5] }, de: { name: f[4], cap: f[6] }, draw: f[7] }));
