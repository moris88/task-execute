import schedule from 'node-schedule'

import { error, info, TaskList, TaskOutput } from '@/lib'

import TaskRunner from './TaskRunner'

interface Config {
  locale?: string
  cron?: string
  start?: string // "immediately" | "scheduled" | "manual";
  end?: string // "completed" | "never";
  timeout?: number
  retry?: {
    maxAttempts?: number
    delay?: number
  }
}

export default class TaskManager {
  private readonly config: Config = {}
  private job: schedule.Job | null = null

  constructor(config?: Partial<Config>) {
    if (config) {
      this.config = {
        ...this.config,
        ...config,
        retry: {
          ...this.config?.retry,
          ...config?.retry,
        },
      }
    }
  }

  async start(taskLists: TaskList[]) {
    if (taskLists.length === 0) {
      error(`❌ No task lists provided to TaskManager.`)
    }
    const execute = async () => {
      let context: Record<string, TaskOutput> = {}

      for (const taskList of taskLists) {
        const runnerConfig = {
          maxRetries: this.config.retry?.maxAttempts ?? 3,
          retryDelayMs: this.config.retry?.delay ?? 1000,
          timeoutMs: this.config.timeout ?? 5000,
          type: taskList.type ?? `sequential`,
          tasks: taskList.tasks ?? [],
        }

        const taskRunner = new TaskRunner(runnerConfig)
        await taskRunner.runTasks(context)
        context = taskRunner.getContext()
      }

      if (this.config?.end === `completed` && this.job) {
        this.job.cancel()
        info(`🛑 Cron job cancelled after execution..`)
      } else if (this.config?.end === `never` && this.job) {
        info(
          `🔄 TaskManager completed execution, waiting for next run: ${this.config.cron}`
        )
      }
    }
    if (this.config.cron) {
      this.job = schedule.scheduleJob(this.config.cron, execute)
      if (this.config?.start === `immediately`) {
        info(`🔄 TaskManager started with cron: ${this.config.cron}`)
        this.job.invoke()
      } else {
        info(`🔄 TaskManager scheduled with cron: ${this.config.cron}`)
      }
    } else {
      execute()
    }
  }
}
