#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { cwd } = require('process');

// Define known file formats
const KNOWN_FORMATS = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.json': 'json',
  '.html': 'html',
  '.css': 'css',
  '.md': 'markdown',
  '.txt': 'text', // Add .txt if needed
};

// Function to scan directories and read file contents
const readFiles = (inputs) => {
  let fileContents = [];

  inputs.forEach((input) => {
    const stats = fs.statSync(input);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(input);
      files.forEach((file) => {
        const filePath = path.join(input, file);
        const fileStats = fs.statSync(filePath);
        if (fileStats.isDirectory()) {
          fileContents.push(...readFiles([filePath])); // Recurse into subdirectories
        } else {
          fileContents.push(filePath);
        }
      });
    } else {
      fileContents.push(input);
    }
  });

  return fileContents;
};

// Function to generate markdown content
const generateMarkdown = (files) => {
  let markdownContent = '';

  files.forEach((file) => {
    const ext = path.extname(file);
    const relativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf8');

    markdownContent += `## ${relativePath}\n\n`;

    // Check file extension and create corresponding code block
    if (KNOWN_FORMATS[ext]) {
      markdownContent += `\`\`\`${KNOWN_FORMATS[ext]}\n${content}\n\`\`\`\n\n`;
    } else {
      markdownContent += `${content}\n\n`; // If no format, display plain content
    }
  });

  return markdownContent;
};

// Configure the program
program
  .name('c2md')
  .option('-i, --input <paths...>', 'Input file(s) or directory(ies)')
  .option('-o, --output <path>', 'Output markdown file')
  .parse(process.argv);

// Get the options
const options = program.opts();

// Check input parameters
if (!options.input || !options.output) {
  console.error('Must specify --input and --output.');
  process.exit(1);
}

// Scan files from input
const files = readFiles(options.input.map((input) => path.join(cwd(), input)));
const markdown = generateMarkdown(files);

// Write markdown content to output file
fs.writeFileSync(options.output, markdown);
console.log(`Markdown file created at: ${options.output}`);
