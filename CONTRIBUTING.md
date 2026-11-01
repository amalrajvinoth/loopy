# Helping with Loopy

Thanks for wanting to help! Here is how.

## Send feedback

| You want to... | Go here |
| --- | --- |
| Report something broken | [Report a problem](https://github.com/amalrajvinoth/loopy/issues/new?template=problem.yml) |
| A question or answer in a game is wrong | Tap the flag at the top of the game. It fills in [Report a game problem](https://github.com/amalrajvinoth/loopy/issues/new?template=game-report.yml) for you. |
| Suggest a new game or feature | [Share an idea](https://github.com/amalrajvinoth/loopy/discussions/new?category=ideas) |
| Ask how something works | [Ask a question](https://github.com/amalrajvinoth/loopy/discussions/new?category=q-a) |
| Report a security problem | [Report it privately](https://github.com/amalrajvinoth/loopy/security/advisories/new) |

You need a free GitHub account. GitHub accounts are for ages 13 and up, so a grown-up should post.

**Everything on GitHub is public.** Never share a child's name, photo, school or other personal details.

## How feedback is handled

1. **Problems** become issues. The owner checks each one, adds a label, and fixes it or explains why not.
2. **Ideas** live in Discussions. People can vote with a 👍. Popular ideas may become new games.
3. **Questions** are answered in Discussions. Common ones are added to the [FAQ](FAQ.md).

## Change the code

1. Fork the repo and make a new branch.
2. Make your change. Keep it small and focused. To add or fix words, facts or countries, edit the game's `words.js` or `data.js` (Word Match and Word Trail share `languages/words.js`). Each game's README says what goes on a line.
3. Test it on a phone size and a computer size, in English and German.
   If you edited a page or anything in `src/`, run `python3 tools/build.py` (see the README) and `python3 tools/check_external.py`.
4. Open a pull request and say what you changed and why.

If you use Claude Code, the repo's plugins load by themselves and run these checks for you. See [plugins/README.md](plugins/README.md).

The owner reviews every pull request before it goes live. See the [README](README.md) for how to add a game.

Please follow the [code of conduct](CODE_OF_CONDUCT.md).
