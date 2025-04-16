import fs from 'node:fs'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: 'ws',
      entry: ['./index.js'],
    },
    emptyOutDir: true,
    outDir: 'dist',
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
    minify: false,
    commonjsOptions: {
      include: [
        './**/*.js',
        /node_modules/,
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
  },
  plugins: [
    {
      name: 'copy-types',
      writeBundle() {
        fs.copyFileSync(
          'node_modules/@types/ws/index.d.mts',
          'dist/index.d.ts',
        )

        fs.copyFileSync(
          'esm.js',
          'dist/index.js',
        )

        /** 替换动态require */
        const dir = 'dist/ws.mjs'
        const data = fs.readFileSync(dir, 'utf8')
        const reg = /const (.*) = require\("bufferutil"\);([\s\S]*?)catch \(e\) {/;
        const newCode = data.replace(reg, (match, variableName, codeBlock) => {
          return `
            import("bufferutil")
              .then((${variableName}) => {
                ${codeBlock.trim()})
        .catch((e) => {
        });
    } catch (e) {`
        })
        fs.writeFileSync(dir, newCode, 'utf8')
      },
    },
  ],
})
