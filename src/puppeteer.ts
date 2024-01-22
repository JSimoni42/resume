import puppeteer from 'puppeteer'

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("http://localhost:8080/resume.html")
await page.setViewport({width: 1080, height: 1024})

await new Promise(async (resolve, reject) => {
    const pdfStream = await page.createPDFStream({
        printBackground: true,
        format: 'Letter'
    })
    pdfStream 
        .on('error', reject)
        .on('end', resolve)
        .pipe(process.stdout)
})

await browser.close();
