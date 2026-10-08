import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = path.dirname(fileURLToPath(import.meta.url))

/**
 * Copies the editor manual (studio/EDITOR-MANUAL.html) into the build as
 * /editor-guide/index.html. It's password-protected by middleware.js.
 */
function editorGuide() {
  let outDir = 'dist'
  return {
    name: 'ukap-editor-guide',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const src = path.join(root, 'studio', 'EDITOR-MANUAL.html')
      if (!fs.existsSync(src)) return
      const dest = path.join(outDir, 'editor-guide')
      fs.mkdirSync(dest, { recursive: true })
      fs.copyFileSync(src, path.join(dest, 'index.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), editorGuide()],
})
