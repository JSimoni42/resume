import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import fs from 'fs'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import {reporter} from 'vfile-reporter'
import path from 'path'
import * as sass from 'sass'
import remarkGfm from 'remark-gfm'

// @ts-expect-error remark-heading-id has no types
import remarkHeadingId from 'remark-heading-id'

const { resume, stylesheet } = yargs(hideBin(process.argv))
    .string([ 'resume', 'stylesheet' ])
    .describe({
        resume: 'A path to a resume written in markdown',
        stylesheet: 'The styles to apply to the resume, written in Sass'
    })
    .normalize([ 'resume', 'stylesheet' ])
    .demandOption('resume')
    .strict(true)
    .parseSync()

const fileContents = fs.readFileSync(
    resume,
    { encoding: 'utf-8' }
)

if (stylesheet) {
    fs.writeFileSync(
        path.join('assets', 'styles.css'),
        sass.compile(stylesheet).css
    )
}

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHeadingId)
  .use(remarkRehype)
  .use(rehypeDocument, {
    title: 'John Simoni', 
    css: './styles.css',
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap' }
    ],
})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(fileContents)

console.error(reporter(file))

fs.writeFileSync(
    path.join('assets', 'resume.html'),
    String(file),
    { encoding: 'utf-8' }
)