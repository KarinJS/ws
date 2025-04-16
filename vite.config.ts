import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['cjs'],
      fileName: 'index',
      entry: ['./index.js'],
    },
    emptyOutDir: true,
    outDir: 'dist/cjs',
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
        'node_modules/**',
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
  }
})
