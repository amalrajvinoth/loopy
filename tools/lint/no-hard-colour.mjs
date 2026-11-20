// loopy/no-hard-colour: a page's styles take their colours from the theme variables (var(--ink), var(--good) and the
// rest in src/loopy.css), so every theme and the high-contrast one look right. A colour written out (#fff, rgb(), hsl())
// in a page or in src/print.css fails the check, with these exceptions, all on purpose:
//   - src/loopy.css itself: that is where the themes are written;
//   - a custom property (--x: #fff): that is where a page defines a colour, and where :root sets the theme's defaults;
//   - a var(--x, #fff) fallback: the variable wins, the colour only covers a browser without it;
//   - @media print: paper is black on white in every theme (all of src/print.css is inside one);
//   - fill, stroke and stop-color: an SVG picture (coins, pizzas, shapes, a ruler) keeps its own colours;
//   - rgb(0 0 0 / a) and rgb(255 255 255 / a): a translucent shade or glow over the theme's own colours (shadows).
// Anything else that is a picture (a bank note, a shop shelf) sits between /* stylelint-disable loopy/no-hard-colour
// -- why */ and /* stylelint-enable loopy/no-hard-colour */, so the exception is written down next to the colours.
import stylelint from "stylelint";

const { createPlugin, utils: { report, ruleMessages, validateOptions } } = stylelint;
export const ruleName = "loopy/no-hard-colour";
export const messages = ruleMessages(ruleName, {
  found: (colour, prop) => `"${colour}" in ${prop}: use a theme variable (var(--ink), var(--good) ...) instead of a written-out colour`,
});
const SKIP_PROPS = new Set(["fill", "stroke", "stop-color", "flood-color", "lighting-color"]);
const COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\((?![^)]*\bfrom\b)[^)]*\)/gi;
const SHADE = /^rgba?\(\s*(?:0\s*,?\s*0\s*,?\s*0|255\s*,?\s*255\s*,?\s*255)\s*[/,]\s*[\d.%]+\s*\)$/i;

function inPrint(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === "atrule" && p.name === "media" && /\bprint\b/.test(p.params)) return true;
  }
  return false;
}

const rule = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;
  if (/(^|[\\/])loopy\.css$/.test(root.source?.input.file || "")) return;
  root.walkDecls((decl) => {
    if (decl.prop.startsWith("--") || SKIP_PROPS.has(decl.prop.toLowerCase()) || inPrint(decl)) return;
    const value = decl.value.replace(/var\(\s*--[\w-]+\s*,[^()]*(?:\([^()]*\)[^()]*)*\)/g, "var()");  // drop fallbacks
    for (const m of value.matchAll(COLOUR)) {
      if (SHADE.test(m[0])) continue;
      report({ message: messages.found(m[0], decl.prop), node: decl, result, ruleName });
      return;
    }
  });
};
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { url: "https://github.com/amalrajvinoth/loopy/blob/main/tools/lint/no-hard-colour.mjs" };
export default createPlugin(ruleName, rule);
