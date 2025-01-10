import { Execute, Logger, getCommandLineArgs } from '@/libs'
import { tasks } from '@/tasks'

export default async function integration(): Promise<void> {
  const commandLineParams = getCommandLineArgs()

  Logger.info(`Parametri dalla riga di comando:`, commandLineParams)
  if (commandLineParams[`--parallel`]) {
    Execute.tasks(tasks, `parallel`)
      .then(({ results, errors }) => {
        Logger.info(`Risultati in parallelo:`, results)
        // [1, null, true]
        Logger.err(`Errori in parallelo:`, errors)
        // [null, Error: "Errore nel task 2", null]
      })
      .catch((error) => {
        Logger.err(`Errore durante l'esecuzione:`, error)
      })
  } else if (commandLineParams[`--sequential`]) {
    Execute.tasks(tasks, `sequential`)
      .then(({ results }) => {
        Logger.info(`Risultati in sequenza:`, results)
      })
      .catch((error) => {
        Logger.err(`Errore durante l'esecuzione:`, error)
      })
  } else {
    Logger.err(
      `Devi specificare un modo di esecuzione (--parallel o --sequential)`
    )
  }
}
