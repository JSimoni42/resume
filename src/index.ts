import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {Processor, unified, Plugin} from 'unified'
import fs from 'fs'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'
import * as sass from 'sass'
import remarkGfm from 'remark-gfm'
import { stream } from 'unified-stream'
import {h} from 'hastscript'
import {visit} from 'unist-util-visit'
import remarkDirective from 'remark-directive'

// @ts-expect-error remark-heading-id has no types
import remarkHeadingId from 'remark-heading-id'

const directiveParser: Plugin = () => (tree) => {
    visit(
        tree, 
        (node) => node.type ==='containerDirective', 
        (node) => {
            // Lines that start with ':::' are containers
            if (!node.data) {
                node.data = {}
            }
            const data = node.data

            //@ts-expect-error These types don't work
            const hast = h(node.name, node.attributes ?? {})

            //@ts-expect-error These types don't work
            data.hName = hast.tagName
            //@ts-expect-error These types don't work
            data.hProperties = hast.properties
        },
    )
}

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

if (stylesheet) {
    fs.writeFileSync(
        path.join('assets', 'styles.css'),
        sass.compile(stylesheet).css
    )
}

const resumeStream = fs.createReadStream(
    resume,
    { encoding: 'utf-8' }
)

const outStream = fs.createWriteStream(
    path.join('assets', 'resume.html'),
    { encoding: 'utf-8' }
)

// @ts-expect-error These types don't line up. `Processor` has `undefined` for type arguments
const unifiedProcessor: Processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHeadingId)
  .use(remarkDirective)
  .use(directiveParser)
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

resumeStream
    .on('error', (e) => console.error(e))
    .pipe(stream(unifiedProcessor))
    .pipe(outStream)
