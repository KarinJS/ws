import fs from 'node:fs'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: 'ws',
      entry: ['./dist/cjs/index.js'],
    },
    emptyOutDir: true,
    outDir: 'dist/esm',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
        'bufferutil',
        'utf-8-validate',
      ],
      output: {
        inlineDynamicImports: true,
      },
      cache: false,
    },
    minify: 'terser',
    commonjsOptions: {
      include: [
        './**/*.js',
        'node_modules/**',
      ],
    },
  },
  plugins: [
    {
      name: 'copy-types',
      writeBundle() {
        fs.copyFileSync(
          'node_modules/@types/ws/index.d.ts',
          'dist/esm/index.d.ts',
        )

        fs.copyFileSync(
          'esm.js',
          'dist/esm/index.js',
        )

        const dir = 'dist/esm/ws.mjs'
        const data = fs.readFileSync(dir, 'utf8')
        const reg = /const (.*) = require\("bufferutil"\);([\s\S]*?)catch \(e\) {/;
        const newCode = data.replace(reg, (match, variableName, codeBlock) => {
          return `
          import("bufferutil")
            .then((module) => {
              const ${variableName} = module
              ${codeBlock.trim()})
      .catch((e) => {
        console.error(e)
      });
  } catch (e) {
    console.error(e)`
        })
        fs.writeFileSync(dir, newCode, 'utf8')
      },
    },
  ],
})
