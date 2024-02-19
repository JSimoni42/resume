import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
    headless: 'new'
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/resume.html", { waitUntil: 'networkidle0' })
await page.setViewport({width: 1080, height: 1024})

await new Promise(async (resolve, reject) => {
    const pdfStream = await page.createPDFStream({
        printBackground: true,
        format: 'Letter',
        pageRanges: '1'
    })
    pdfStream 
        .on('error', reject)
        .on('end', resolve)
        .pipe(process.stdout)
})

await browser.close();
