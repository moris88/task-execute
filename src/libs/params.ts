export function getCommandLineArgs() {
  const args = process.argv.slice(2) // Rimuove i primi due elementi (node e il file)
  const params: Partial<Record<string, any>> = {}

  args.forEach((arg) => {
    const [key, value] = arg.split('=')
    if (value !== undefined) {
      params[key] = value
    } else {
      params[arg] = true // Imposta true se è solo il nome del parametro senza valore
    }
  })

  return params
}