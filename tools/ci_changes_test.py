#!/usr/bin/env python3
"""tools/ci_changes.py picks the right browser tests and pages. Runs on the real repo: python3 tools/ci_changes_test.py"""
import json, pathlib, sys, unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ci_changes as c  # noqa: E402


def plan(*paths, status="M"):
    return c.plan([(status, p) for p in paths])


def pages(value):
    return value if value in ("all", "none") else json.loads(value)


class Picks(unittest.TestCase):
    def test_one_game_tests_that_game(self):
        p = plan("math/plus-minus/index.html", "sw.js")
        for job in ("a11y", "play", "retry", "pictures"):
            self.assertEqual(pages(p[job]), ["math/plus-minus/"], job)
        # Sync and switch open Plus and Minus; the offline test reads the built sw.js. Levels does not open it.
        self.assertEqual(json.loads(p["extras"]), ["offline", "sync", "switch"])
        self.assertTrue(p["lighthouse"])

    def test_a_game_off_the_picture_list_has_no_picture_test(self):
        p = plan("math/coins-change/data.js")
        self.assertEqual(pages(p["play"]), ["math/coins-change/"])
        self.assertEqual(p["pictures"], "none")

    def test_a_file_another_page_loads_tests_both(self):
        self.assertEqual(pages(plan("languages/spelling-quiz/words.js")["play"]), ["languages/my-words/", "languages/spelling-quiz/"])
        self.assertEqual(pages(plan("languages/words.js")["play"]), ["languages/word-match/", "languages/word-trail/"])

    def test_today_10_is_left_out_of_try_again(self):
        p = plan("mix/daily-mix/index.html")
        self.assertEqual(p["retry"], "none")
        self.assertEqual(pages(p["play"]), ["mix/daily-mix/"])
        self.assertIn("levels", json.loads(p["extras"]))

    def test_home_and_help(self):
        p = plan("index.html")
        self.assertEqual(pages(p["a11y"]), [""])
        self.assertEqual(p["play"], "none")
        self.assertEqual(len(json.loads(p["extras"])), 5)   # every extra test starts on the home page
        self.assertEqual(json.loads(plan("help/index.html")["extras"]), ["hello"])

    def test_shared_files_test_everything(self):
        for path in ("src/loopy.js", "loopy.css", "fonts/lexend-latin.woff2", "manifest.webmanifest", "tools/e2e/engine.mjs",
                     "tools/a11y/package-lock.json", ".github/workflows/checks.yml", "tools/ci_changes.py", "something-new.txt"):
            p = plan(path)
            self.assertEqual([p[j] for j in ("a11y", "play", "retry", "pictures")], ["all"] * 4, path)
            self.assertEqual(len(json.loads(p["extras"])), 5, path)

    def test_a_deleted_page_tests_everything(self):
        self.assertEqual(plan("math/no-such-game/index.html", status="D")["play"], "all")

    def test_one_test_runs_only_that_test(self):
        p = plan("tools/e2e/play.mjs")
        self.assertEqual((p["play"], p["a11y"], p["retry"], p["pictures"]), ("all", "none", "none", "none"))
        self.assertEqual(json.loads(plan("tools/e2e/levels.mjs")["extras"]), ["levels"])
        self.assertEqual(plan("tools/e2e/pictures/home-en-390x844.png")["pictures"], "all")

    def test_no_browser_test(self):
        for path in ("README.md", "plugins/loopy/RULES.md", ".claude/settings.json", "tools/lint/check.mjs", "tools/review.py",
                     ".github/workflows/pages.yml", "guide-src/astro.config.mjs"):
            self.assertFalse(plan(path)["site"], path)

    def test_sync_server_runs_the_sync_test(self):
        p = plan("sync/package-lock.json")
        self.assertEqual(json.loads(p["extras"]), ["sync"])
        self.assertEqual(p["play"], "none")

    def test_chess_tools_belong_to_the_chess_page(self):
        self.assertEqual(pages(plan("tools/chess/build.mjs")["play"]), ["brain/chess-puzzles/"])

    def test_guide(self):
        self.assertTrue(plan("guide-src/astro.config.mjs")["guide"])
        self.assertTrue(plan("math/plus-minus/x.js", status="A")["guide"])
        self.assertFalse(plan("math/plus-minus/index.html")["guide"])

    def test_push_to_main_runs_everything(self):
        p = c.everything()
        self.assertEqual((p["a11y"], p["play"], p["lighthouse"], p["guide"]), ("all", "all", True, True))

    def test_lighthouse_pages(self):
        self.assertEqual(c.lighthouse_pages([("M", "math/plus-minus/index.html"), ("M", "sw.js")]), ["", "math/plus-minus/"])
        self.assertEqual(c.lighthouse_pages([("M", "src/loopy.css")]), ["", *c.SAMPLE])


if __name__ == "__main__":
    unittest.main(verbosity=1)
