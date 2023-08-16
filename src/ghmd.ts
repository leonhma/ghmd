#!/usr/bin/env node

import { program } from "commander";
import { existsSync, readFileSync, writeFileSync } from "fs";
import style from "./index.scss";
import template from "./template.mustache";
import fetch from "node-fetch"
import { render } from "mustache";
import { getType } from "mime";
import { dirname, join } from "path";

program
    .name("ghmd")
    .description("A simple CLI to convert markdown files to HTML")
    .requiredOption("-i, --input <file>", "Input markdown file")
    .option("-o, --output <file>", "Output HTML file");

program.parse();

const options = program.opts();

(async () => {
    const md = readFileSync(options.input).toString();

    let content = await fetch("https://api.github.com/markdown", {
        method: "POST",
        body: JSON.stringify({ text: md.toString() }),
        headers: {
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
    }).then((res) => res.text());
    let urlmap = new Map<string, string>();
    for (const match of content.matchAll(/(?<=src=")(?!http).+?\.\w+?(?=")/g)) {
        console.log("found possible path", match[0]);
        const path = join(dirname(options.input), match[0]);
        if (!existsSync(path)) {
            console.log("File not found");
        }
        const data = readFileSync(path);
        const mime = getType(path);
        console.log("Mime type: ", mime);
        urlmap.set(match[0], `data:${mime};base64,${data.toString("base64")}`);
    }
    for (const [key, value] of urlmap) {
        content = content.replace(`src="${key}"`, `src="${value}"`);
    }
    const markup = render(template, { style, content });
    writeFileSync(
        options.output || options.input.replace(/\.md$/, ".html"),
        markup
    );
})();
