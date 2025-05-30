import {
  error,
  info,
  TaskExecutor,
  TaskInput,
  TaskOutput,
  TypedTask,
  warn,
} from '@/lib'

interface TaskRunnerConfig {
  type?: `sequential` | `parallel`
  tasks?: TypedTask<TaskInput, any>[]
  [key: string]: any // per compatibilità con config extra
}

export default class TaskRunner {
  private readonly taskRunner: TaskExecutor
  private readonly config: Required<TaskRunnerConfig>

  constructor(config?: TaskRunnerConfig) {
    const defaultConfig: Required<TaskRunnerConfig> = {
      type: `sequential`,
      tasks: [],
    }

    this.config = { ...defaultConfig, ...config }

    info(`🔄 Initializing TaskRunner...`)

    this.taskRunner = new TaskExecutor(
      (task) => {
        warn(`🟡 Start: ${task.name}`)
      },
      (task, result) => {
        info(`🟢 Done: ${task.name} →`, result)
      },
      (task, err) => {
        error(`🔴 Error: ${task.name} →`, err)
      },
      this.config as any
    )

    info(`✅ TaskRunner successfully initialized`)
  }

  getContext(): Record<string, TaskOutput> {
    return this.taskRunner.getContext()
  }

  async runTasks(context?: Record<string, TaskOutput>): Promise<void> {
    const { type, tasks } = this.config

    info(`🚀 Start task execution...`)
    info(`🧭 Type of execution: ${type}`)

    if (!Array.isArray(tasks) || tasks.length === 0) {
      error(
        `❌ No tasks to execute. Pass a valid array of tasks, in the file src/tasks/index.ts.`
      )
      return
    }

    const invalid = tasks.some(
      (task) =>
        typeof task !== `object` ||
        task === null ||
        typeof task.name !== `string` ||
        typeof task.execute !== `function`
    )

    if (invalid) {
      error(`❌ Some tasks are not valid instances of TypedTask.`)
      return
    }

    try {
      const method =
        type === `sequential`
          ? this.taskRunner.runSequential.bind(this.taskRunner)
          : type === `parallel`
            ? this.taskRunner.runParallel.bind(this.taskRunner)
            : null

      if (!method) {
        error(`❌ Unsupported execution type. Use 'sequential' or 'parallel'.`)
        return
      }

      info(`🔄 Running tasks in mode ${type}...`)

      const results = await method(
        tasks satisfies TypedTask<TaskInput, any>[],
        context
      )

      info(`✅ Execution completed successfully`)
      info(`📦 Results:`, results)
    } catch (err) {
      error(`❌ Error while executing tasks:`, err)
    } finally {
      info(`🔚 Execution completed`)
    }
  }
}
