// What the shared script gives every page: window.Loopy. Plain JavaScript in src/ is checked against this
// file by TypeScript (checkJs; tools/build/tsconfig.json), so a wrong call to Loopy.* fails in seconds instead
// of in the play test. This file is never served and never built; it is only for the check and for anyone
// (or any coding agent) who wants to see the whole API on one page.
//
// How to read it: `?` means the part is only there after its block in src/loopy.js ran, or after Loopy.load()
// fetched the lazy part (loopy-backup.js, loopy-sync.js, ...). Pages call the parts in document order, so
// the check does not insist on null checks (strictNullChecks is off). Add a member here when you add one
// to Loopy, in the same pull request. Keep every type honest: `any` only where the real shape varies.

type Lang = "en" | "de";
type Strings = { [key: string]: string };
type Detail = { [key: string]: any };

/** A problem a game makes with Loopy.fresh / Loopy.retry.fresh: `key` names the question so it does not repeat. */
interface Problem {
  key: string;
  [field: string]: any;
}

interface LoopyStore {
  /** The current child's value under `k` (a plain "game.setting" key, prefixed per child inside). */
  get(k: string): string | null;
  set(k: string, v: string): void;
  remove(k: string): void;
}

interface LoopyKid {
  id: any;
  name: string;
  pic: string;
  age?: number;
  [field: string]: any;
}

interface LoopyKids {
  PICS: string[];
  MAX: number;
  cleanName(name: any): string;
  /** True when no child was ever saved on this device (the first visit). */
  fresh: boolean;
  list(): LoopyKid[];
  current(): LoopyKid;
  label(k: LoopyKid): string;
  use(id: any): void;
  pick(id: any): void;
  key(id: any, k: string): string;
  /** A new child; gives the new id. */
  create(name: string, pic?: string): any;
  add(name: string, pic?: string, age?: number): void;
  edit(id: any, name: string, pic?: string): void;
  remove(id: any): void;
  [member: string]: any;
}

interface LoopyRewards {
  BADGES: any[];
  STAR_PATH: string;
  /** { stars, best: {game: streak}, played, brave, ... } as saved for the child. */
  get(): any;
  clean(raw: any): any;
  last(): any;
  badgeFor(stars: number): any;
  nextBadge(stars: number): any;
  confetti(): void;
  /** The big cheer card: a title, a line under it, big or small, and its buttons [{label, fn}]. */
  celebrate(title: string, text?: string, big?: boolean, buttons?: { label: string; fn?: () => void }[], calm?: boolean): void;
  extra(): any;
  bestStreak(): number;
  played(): any;
  /** A wrong answer: no star, the streak ends. `detail` is the game's rebuild note for Try again. */
  wrong(game: string, detail?: Detail): void;
  /** A right answer: one star, the streak grows, badges and the day may follow. */
  correct(game: string, streak?: number, harder?: any, kind?: string): void;
  [member: string]: any;
}

interface LoopyLevels {
  /** The game's ladder: one name per level (a string key for Loopy.t or a function), get() the level the saved
   *  settings mean, set(i) saves level i, base() the level the age picker starts at. */
  init(opts: { names: (string | (() => string))[]; get: () => number; set: (i: number) => void; base?: () => number; [option: string]: any }): any;
  render(): void;
  harder(game?: string): any;
  up(game: string): void;
  seen(game?: string): any;
  ripe(game: string): any;
  get(): any;
  stuck(game: string): any;
  offer(kind: string): void;
  [member: string]: any;
}

interface LoopyDaily {
  BADGES: any[];
  clean(raw: any): any;
  get(): { [field: string]: any };
  /** Only Today's 10 calls this: a finished round is the one thing that counts a day. */
  finish(): void;
  [member: string]: any;
}

interface LoopyLog {
  MAX_WRONG: number;
  clean(raw: any): any;
  get(): { days: { [day: string]: { [game: string]: any } }; [field: string]: any };
  add(game: string, ok: boolean, detail?: Detail): void;
  clear(): void;
  byKind(days: any, game?: string): any;
  kind(op: string, a: number, b: number): string;
  timeKind(m: number): string;
  practise(): any;
  hint?: any;
  [member: string]: any;
}

interface LoopyRetry {
  DAYS: number;
  list(): any[];
  game(): string | null;
  /** The game's next problem: a pending mistake first, then a fresh one from `make` (see Loopy.fresh). */
  fresh(game: string, recent: any[], make: () => Problem, rebuild?: (note: Detail) => Problem | null, keep?: number): Problem;
  opened(): boolean;
  hand(game: string, note: Detail): void;
  fixed(game: string): void;
  missed(game: string, detail: Detail): void;
  [member: string]: any;
}

interface LoopyRecent {
  KEEP: number;
  clean(raw: any): any;
  get(game: string): number[];
  add(game: string, ok: boolean): void;
  clear(game: string): void;
  [member: string]: any;
}

interface LoopySpeech {
  /** The Read aloud pill: host gets the button, text() is read on a tap, lang() the voice's language. */
  question(o: { host: HTMLElement; text: () => string; lang?: () => string; inline?: boolean; [option: string]: any }): void;
  toggle(o?: any): void;
  read(): void;
  [member: string]: any;
}

interface LoopySound {
  play(name: string): void;
  isOn(): boolean;
}

interface LoopyKeep {
  db: boolean;
  persisted: boolean;
  done: boolean;
  soon(): void;
  [member: string]: any;
}

interface LoopyBackup {
  /** light: true or 1 leaves out old history for a shorter code, 2 leaves out more (the QR code). */
  exportCode(only?: any, light?: boolean | 1 | 2): any;
  importCode(code: string, opts?: any): any;
  peek(code: string): any;
  link(code: string): string;
  /** The QR code of `text` as { n: modules per side, path: an SVG path, v: version }, or null when it does not fit. */
  qr?(text: string, maxVersion?: number): any;
  MAX_CODE: number;
  [member: string]: any;
}

interface LoopySync {
  state(): any;
  listen(f: (state: any) => void): void;
  clean(raw: any): any;
  create(): Promise<any>;
  join(code: string): Promise<any>;
  off(forget?: boolean): Promise<any>;
  now(): Promise<any>;
  settings(box: HTMLElement): void;
  panel(box: HTMLElement, mode: "create" | "join"): void;
  share(): void;
  touch(): void;
  [member: string]: any;
}

/** Loopy.worksheet(options) builds the printable sheet; Loopy.worksheet.state is where loopy-sheet.js reads it. */
type LoopyWorksheet = ((o: { [option: string]: any }) => any) & { state?: any };

interface Loopy {
  // Languages
  /** "en" or "de" */
  lang: string;
  addStrings(d: { en?: Strings; de?: Strings }): void;
  /** The text for `key` in loopy's language, with `{name}` parts filled from `vars`. Unknown keys come back as they are. */
  t(key: string, vars?: { [name: string]: any }): string;
  /** A number the way the language writes it (1,000 or 1.000). */
  num(n: number): string;
  /** The sign for "add", "sub", "mul" or "div" as the school writes it: × and ÷ in English, · and : in German. */
  sign(op: string): string;
  /** A sum saved with × or ÷ (a mistake on the Try again card) rewritten in this language's signs. */
  signs(text: string): string;
  setLang(l: string): void;

  // Small helpers
  /** A new element: Loopy.el("button", "kid-btn", "Dio"). cls and text may be left out. */
  el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K];
  el(tag: string, cls?: string, text?: string): HTMLElement;
  /** `n` as a whole number from 0 to `max`, or 0 for anything else (for values read from storage). */
  whole(n: any, max: number): number;
  GAMES: string[];
  /** The next problem that is not in `recent` (the last `keep`, default 10): `make` is called until it finds one. */
  fresh(recent: any[], make: () => Problem, keep?: number): Problem;
  dayKey(daysAgo?: number): string;
  /** Where loopy.js was loaded from, with a trailing slash. Pages load their parts from here. */
  root: string;
  /** Fetch a lazy part once: Loopy.load("backup") gives loopy-backup.js. */
  load(name: string): Promise<void>;
  /** The real loopy logo as inline SVG, for every print and the back button. */
  logo(cls?: string, ids?: string): string;
  /** The Next button shows only after an answer; call it on every answer and on every new question. */
  nextButton(btn: HTMLElement | null, answered: boolean): void;
  syncHost: string;
  syncPage?: string;

  // The child playing and what is saved
  store: LoopyStore;
  kids: LoopyKids;
  keep?: LoopyKeep;
  last: { get(): string | null; clean(raw: any): string | null; [member: string]: any };
  /** The age from the birth date loopy assumes when nothing is set (August 2018). */
  defaultAge(): number;
  getAge(): number;
  setAge(n: number): void;

  // Sound, speech, stars and levels
  sound: LoopySound;
  speech: LoopySpeech;
  rewards: LoopyRewards;
  levels: LoopyLevels;
  daily: LoopyDaily;
  log: LoopyLog;
  retry: LoopyRetry;
  recent: LoopyRecent;
  hint: { done(): void; [member: string]: any };
  worksheet: LoopyWorksheet;

  // Lazy parts (after Loopy.load)
  backup: LoopyBackup;
  report?: { open(o?: any): void; snap(): any };
  sheet?: { fill(o?: any): void };
  install?: { open(o?: any): void };
  sync?: LoopySync;
  hello?: { read(): any; start(o?: any): void };
  levelsTable?: any;
  /** { at, of, base, name }: the level a child of `age` starts `game` on (loopy-levels.js). */
  levelOf?(game: string, age: number): any;
}

interface Window {
  Loopy: Loopy;
  webkitAudioContext?: typeof AudioContext;
}

interface Navigator {
  /** iPhone and iPad Safari: true inside the home screen app. */
  standalone?: boolean;
}

declare var Loopy: Loopy;
