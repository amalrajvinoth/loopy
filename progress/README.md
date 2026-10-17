# How it's going

A page for grown-ups. It shows how the week went, what to practise next, and how a child is doing in each game.

Open it from the link **For grown-ups: how it's going** at the bottom of the home page.

## What it shows

- **This week in one line.** How many answers this week (Monday to today) and how many percent were right, with "▲ up from 72% last week" or "▼ down from 85% last week", and how many days were played. Under it: stars, day streak and badge, and four small bars with the percent right for the last four weeks.
- **Practise next.** The three kinds of question missed most this week, for example "7 times table", "Clock: minutes in fives" or "Taking away with regrouping". Each one says how often and in which games, gives one line of what to practise, and has a **Practise →** button. The button opens the game set to just that kind for this visit: Times Tables Sprint with only the 7s, What Time Is It? at five-minute steps, Plus and Minus on taking away with regrouping. The child's saved level does not change. When this week has fewer than three, last week fills in. A game with 20 answers or more and 90% right over two weeks gets a **Ready for more** row with a **Level up →** button, which opens the game with its Settings showing.
- **Game by game.** For each game played this week or last week: how many answers were right (✓) and wrong (✗), with a bar, "▲ Better than last week" or "▼ Harder than last week" when both weeks have 5 answers or more and the percent moved by 5 or more, and one tip. Today's 10 has its own card. Games not played in two weeks fold into one line.
- **Answers to practise.** Every wrong answer from the last 30 days, grouped by kind, the kind missed most this week first. Each group says "9 this week · 10 in 30 days" and opens on tap, newest first, with the right answer, the answer given, the game and the day. The first group starts open. 5 show at a time; tap **Show 5 more** for the rest.

## Kinds of question it knows

| Game | Kinds |
| --- | --- |
| Plus and Minus | Adding, adding with carrying, taking away, taking away with regrouping |
| Times and Share, Times Tables Sprint | A times table (for example the 7 times table), sharing by a number, times or sharing with bigger numbers |
| Make 10 | Pairs that make 10, pairs that make 20, pairs that make 100 |
| What Time Is It? | O'clock, half past, quarter past and quarter to, minutes in fives, single minutes |
| Bigger or Smaller | Comparing numbers, putting numbers in order, rounding, comparing decimals, minus numbers |
| Pizza Fractions | Naming, comparing and adding fractions |
| Coins and Change | Adding small coins, counting notes and coins, giving change, change with any price |
| Equation Balance | Missing numbers, x + a = b, 3x = 12, 3x + 4 = 19, x on both sides |
| Sound Spell | The sound at the start of a word, the sound at the end of a word |
| Word Match | Words for animals, food, things at home, school |
| Spell It | 3, 4, 5 and longer words |
| Quick Facts | Space, animals, the body |
| Where Is It? | Continents and oceans, countries of Europe, capitals of Europe, countries of the world, capitals of the world |
| Flags and Capitals | Flags, capitals |
| Today's 10 | Any of the sums and clock kinds above; the Practise button opens the game that owns the kind |

## How the Practise button works

The button opens the game as `…/math/times-sprint/#practise=mul-7`. `loopy.js` reads the hint once (`Loopy.log.hint`) and takes it off the address, so a reload starts the game as normal. Each game checks the hint when it loads its settings and sets the matching switch in memory only. `#practise=harder` opens the game with the Settings panel open.

## Your data

- The answers are saved only in this browser on this device. Nothing is sent anywhere.
- Answers older than 30 days are deleted by themselves.
- They are in the stars code, so moving stars to another device moves them too.
- **Clear answers** deletes them. Tap it twice, so one stray tap does nothing. Stars and badges stay.

## Settings

The color theme, the reading font and the language (EN or DE) are behind the ⚙ Settings button at the top of the page, like in the games.

## Example

> **This week, Monday to today**
> 133 answers · 80% right
> ▲ up from 72% last week · Played 4 of 5 days
>
> **Practise next**
> 7 times table. Missed 9 times this week in Times and Share and Times Tables Sprint. Practise the 7 times table. [Practise →]
