import esbuild from 'esbuild'
import fs from 'fs'
const { log } = console

esbuild
  .build({
    entryPoints: [`./src/main.ts`],
    bundle: true,
    outfile: `./dist/index.cjs`,
    platform: `node`,
    minify: true,
  })
  .then(() => {
    fs.copyFileSync(`./src/config.json`, `./dist/config.json`)
    fs.copyFileSync(`./src/mapping.json`, `./dist/mapping.json`)
    log(`✅ Build completato con successo!`)
    log(`📦 File di output: dist/index.cjs`)
    process.exit(0)
  })
  .catch((error) => {
    log(error)
    process.exit(1)
  })
