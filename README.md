# Markdown Resume

A simply-formatted resume with tools to upscale into more complicated formats.

## How-Tos

### Markdown -> HTML

1. Make changes to `src/` files
2. `npm run build` or `npm run watch` to generate HTML / CSS files
3. `npm run start-server` to run a simple web server to look at files

### HTML -> PDF

1. Start the web server with `npm run start-server`
2. Run puppeteer and redirect stdout to the desired file path
    ```bash
    npm run --silent capture-pdf > ./resume.pdf
    ```
