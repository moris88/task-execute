import { InputTask, OutputTask, Task } from "@/types"


async function tasksInSequence(
  tasks: Task[]
): Promise<{ results: OutputTask[] }> {
  const results: OutputTask[] = []
  let previousResult: InputTask = { results: [], args: null }

  for (const task of tasks) {
    try {
      // Passa il risultato del tasany precedente come input al tasany corrente
      const result = await task(previousResult)
      results.push(result)
      previousResult = { results, args: result } // Aggiorna il risultato precedente
    } catch (error) {
      throw error // Rilancia l'errore per fermare l'esecuzione
    }
  }

  return { results }
}

async function tasksInParallel(
  tasks: Task[]
): Promise<{ results: OutputTask[]; errors: (Error | null)[] }> {
  const results: OutputTask[] = []
  const errors: (Error | null)[] = []

  const promises = tasks.map(async (task, index) => {
    try {
      return { result: await task(null), error: null } // Passa null come input
    } catch (error) {
      return { result: null, error: error as Error }
    }
  })

  const taskResults = await Promise.all(promises)

  for (const taskResult of taskResults) {
    if (taskResult.result !== null) {
      results.push(taskResult.result)
    }
    errors.push(taskResult.error)
  }

  return { results, errors }
}

export type ExecutionMode = 'sequential' | 'parallel'

export async function tasks(
  tasks: Task[],
  mode: ExecutionMode = 'parallel'
): Promise<{ results: OutputTask[]; errors?: (Error | null)[] }> {
  switch (mode) {
    case 'sequential':
      return tasksInSequence(tasks)
    case 'parallel':
      return tasksInParallel(tasks)
    default:
      throw new Error('Invalid execution mode')
  }
}
