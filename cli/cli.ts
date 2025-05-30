#!/usr/bin/env node

import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'

const templates = {
  task: (name: string) => `import { info, TypedTask } from '@/lib'

type Input = {}
type Output = {}

export const ${name}: TypedTask<Input, Output> = {
  name: '${name}',
  description: '',
  async execute(input) {
    info('Esecuzione del task test', input)
    // Implementa la logica della tua task qui
    // Puoi accedere a input.context per i dati precedenti

    // Esempio di output:
    // return { success: true, output: { message: "Task completed successfully" } }
    return { success: true, output: null }
  },
}
`,
  config: () =>
    JSON.stringify(
      {
        locale: 'it',
        cron: '*/2 * * * *',
        start: 'immediately',
        end: 'never',
        log: 'on',
        timeout: 60000,
        retry: { maxAttempts: 3, delay: 5000 },
      },
      null,
      2
    ),
  mapping: () => JSON.stringify({ integrazione: [] }, null, 2),
  env: () => `FRESHSERVICE_API_KEY=""
FRESHSERVICE_DOMAIN=""
ZOHO_API_DOMAIN=""
ZOHO_CLIENT_ID=""
ZOHO_CLIENT_SECRET=""
ZOHO_REFRESH_TOKEN=""
LOG_DIR="logs"
DEVELOPER_MODE="true"
`,
} as const

async function main() {
  const { templateType }: { templateType: keyof typeof templates } =
    await inquirer.prompt([
      {
        type: 'list',
        name: 'templateType',
        message: 'Scegli il tipo di template da creare:',
        choices: Object.keys(templates),
        default: 'task',
      },
    ])

  let filename: string
  let content: string
  let outputPath: string

  if (templateType === 'task') {
    const { taskName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'taskName',
        message: 'Nome del Task (es. "MyTask"):',
        validate: (input) =>
          input.trim() !== '' || 'Il nome non può essere vuoto',
      },
    ])
    filename = `${taskName}.ts`
    content = templates.task(taskName)
    outputPath = path.resolve(process.cwd(), 'src/tasks', filename)
  } else if (templateType === 'env') {
    filename = '.env'
    content = templates.env()
    outputPath = path.resolve(process.cwd(), filename)
  } else {
    filename = `${templateType}.json`
    content = templates[templateType]()
    outputPath = path.resolve(process.cwd(), 'src', filename)
  }

  if (fs.existsSync(outputPath)) {
    console.error(`❌ Il file ${filename} esiste già!`)
    process.exit(1)
  }

  fs.writeFileSync(outputPath, content)
  console.log(`✅ File creato: ${outputPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
