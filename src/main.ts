import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";
import fetch from 'node-fetch';
import style from './index.scss'
import showdown from 'showdown';

program
    .name("ghmd")
    .description("A simple CLI to convert markdown files to HTML")
    .requiredOption("-i, --input <file>", "Input markdown file")
    .option("-o, --output <file>", "Output HTML file");

program.parse();

const options = program.opts();

console.log(options);

(async () => {
    const md = readFileSync(options.input);
    const converter = new showdown.Converter();
    //const htmltext = converter.makeHtml(md.toString());
    const htmltext = await fetch("https://api.github.com/markdown", {
        method: "POST",
        body: JSON.stringify({ text: md.toString() }),
        headers: {
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
    }).then((res) => res.text());
    const markup = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>GHMD</title><style lang="css">${style}</style></head><body><article class="markdown-body" itemprop="text">${htmltext}</article></body></html>`;
    writeFileSync(options.output || options.input.replace(/\.md$/, ".html"), markup);
})();
