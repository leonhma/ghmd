import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import style from "./index.scss";
import template from "./template.mustache";
import { render } from "mustache";

program
    .name("ghmd")
    .description("A simple CLI to convert markdown files to HTML")
    .requiredOption("-i, --input <file>", "Input markdown file")
    .option("-o, --output <file>", "Output HTML file");

program.parse();

const options = program.opts();

(async () => {
    const md = readFileSync(options.input);
    const content = await fetch("https://api.github.com/markdown", {
        method: "POST",
        body: JSON.stringify({ text: md.toString() }),
        headers: {
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
    }).then((res) => res.text());
    const markup = render(template, { style, content });
    writeFileSync(
        options.output || options.input.replace(/\.md$/, ".html"),
        markup
    );
})();
