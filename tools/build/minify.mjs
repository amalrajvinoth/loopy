// Minify loopy's scripts and styles with esbuild. Called by tools/build.py, never by hand.
//
// Reads {"name": "source text", ...} from stdin and writes {"name": "minified text", ...} to stdout.
// Each name is a file in src/: .js files are scripts (the Loopy parts, plain scripts with no modules,
// so top-level names stay as they are), .css files are styles. Nothing is bundled or rewritten for
// older browsers: the sources already use only what every supported browser knows (see DESIGN.md).
// Non-ASCII letters (ä, ö, ü, ß, ×, ÷, €) stay as they are instead of \u escapes, which is smaller.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json"));
const { transform } = require("esbuild");

let input = "";
for await (const chunk of process.stdin) input += chunk;
const files = JSON.parse(input), out = {};
for (const [name, text] of Object.entries(files)) {
  const css = name.endsWith(".css");
  const result = await transform(text, {
    loader: css ? "css" : "js",
    minify: true,
    charset: "utf8",
    legalComments: "none",
    logLevel: "warning",
    sourcefile: "src/" + name,
  });
  out[name] = result.code.trim() + "\n";
}
process.stdout.write(JSON.stringify(out));
