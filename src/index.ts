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

const { inFile } = yargs(hideBin(process.argv))
    .string('inFile')
    .describe('inFile', 'A path to a markdown file')
    .normalize('inFile')
    .demandOption('inFile')
    .parseSync()

const fileContents = fs.readFileSync(
    inFile,
    { encoding: 'utf-8' }
)

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: 'John Simoni'})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(fileContents)

console.error(reporter(file))

fs.writeFileSync(
    path.join('assets', 'resume.html'),
    String(file),
    { encoding: 'utf-8' }
)