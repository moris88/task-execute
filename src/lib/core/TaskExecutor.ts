import { BaseTask, error, info, TaskInput, TaskOutput, warn } from '@/lib'

type TaskEventCallback = (task: BaseTask, result?: TaskOutput) => void

interface ExecutorConfig {
  maxRetries?: number
  retryDelayMs?: number
  timeoutMs?: number
}

export default class TaskExecutor {
  private taskResults: Record<string, TaskOutput> = {}
  private readonly onTaskStart?: TaskEventCallback
  private readonly onTaskComplete?: TaskEventCallback
  private readonly onTaskError?: (task: BaseTask, error: any) => void
  private readonly config: Required<ExecutorConfig>

  constructor(
    onTaskStart?: TaskEventCallback,
    onTaskComplete?: TaskEventCallback,
    onTaskError?: (task: BaseTask, error: any) => void,
    config?: ExecutorConfig
  ) {
    this.onTaskStart = onTaskStart
    this.onTaskComplete = onTaskComplete
    this.onTaskError = onTaskError

    const defaultConfig: Required<ExecutorConfig> = {
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 5000,
    }

    this.config = { ...defaultConfig, ...config }
  }

  getContext(): Record<string, TaskOutput> {
    return this.taskResults
  }

  private async runWithRetry(
    task: BaseTask,
    input: TaskInput
  ): Promise<TaskOutput> {
    const { maxRetries, retryDelayMs } = this.config

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        info(`▶️ Running "${task.name}" attempt ${attempt + 1}`)
        return await this.runWithTimeout(task, input)
      } catch (err) {
        if (attempt < maxRetries) {
          warn(
            `⚠️ Task "${task.name}" failed (attempt ${
              attempt + 1
            }), retrying...`
          )
          await new Promise((res) => setTimeout(res, retryDelayMs))
        } else {
          error(
            `❌ Task "${task.name}" failed after ${maxRetries + 1} attempts`
          )
          throw err
        }
      }
    }

    throw new Error(`Retries exhausted for task "${task.name}"`)
  }

  private async runWithTimeout(
    task: BaseTask,
    input: TaskInput
  ): Promise<TaskOutput> {
    const timeoutMs = task.timeoutMs ?? this.config.timeoutMs

    const taskPromise = task.execute(input || {})
    const timeoutPromise = new Promise<TaskOutput>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout: "${task.name}" after ${timeoutMs}ms`)),
        timeoutMs
      )
    )

    return Promise.race([taskPromise, timeoutPromise])
  }

  async runSequential(
    tasks: BaseTask[],
    context?: Record<string, TaskOutput>
  ): Promise<TaskOutput[]> {
    this.taskResults = {}
    const results: TaskOutput[] = []
    let prevOutput: any = {}

    for (const task of tasks) {
      this.onTaskStart?.(task)
      try {
        const input: TaskInput = {
          ...prevOutput,
          context: { ...context, ...this.taskResults },
        }

        const result = await this.runWithRetry(task, input)
        this.taskResults[task.name] = result
        this.onTaskComplete?.(task, result)
        results.push(result)
        prevOutput = result.output
      } catch (error) {
        const result: TaskOutput = { success: false, output: { error } }
        this.taskResults[task.name] = result
        this.onTaskError?.(task, error)
        results.push(result)
      }
    }

    return results
  }

  async runParallel(
    tasks: BaseTask[],
    context?: Record<string, TaskOutput>
  ): Promise<TaskOutput[]> {
    this.taskResults = {}

    const results: TaskOutput[] = await Promise.all(
      tasks.map(async (task) => {
        this.onTaskStart?.(task)
        try {
          const input: TaskInput = {
            context: { ...context, ...this.taskResults },
          }

          const result = await this.runWithRetry(task, input)
          this.taskResults[task.name] = result
          this.onTaskComplete?.(task, result)
          return result
        } catch (error) {
          const result: TaskOutput = { success: false, output: { error } }
          this.taskResults[task.name] = result
          this.onTaskError?.(task, error)
          return result
        }
      })
    )

    return results
  }
}
