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
  .use(remarkRehype)
  .use(rehypeDocument, {title: 'John Simoni', css: './styles.css'})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(fileContents)

console.error(reporter(file))

fs.writeFileSync(
    path.join('assets', 'resume.html'),
    String(file),
    { encoding: 'utf-8' }
)