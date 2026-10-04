// Renders the app to static HTML and injects it into dist/index.html, so search engines
// (and visitors on slow connections) get the full page immediately.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const template = path.join(root, 'dist/index.html')
const serverEntry = pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href

const { render } = await import(serverEntry)
const appHtml = render()

const html = fs.readFileSync(template, 'utf8')
const marker = '<div id="root"><!--app--></div>'
if (!html.includes(marker)) throw new Error('Prerender marker not found in dist/index.html')

fs.writeFileSync(template, html.replace(marker, `<div id="root" data-ssr>${appHtml}</div>`))
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`✓ prerendered ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
