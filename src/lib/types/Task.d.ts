export interface TaskInput {
  context: Record<string, TaskOutput>
  [key: string]: any // altri input opzionali
}

export interface TaskOutput {
  success: boolean
  output: Record<string, any>
}

export interface BaseTask<Input = TaskInput, Output = any> {
  name: string
  description: string
  timeoutMs?: number
  execute: (input: Input) => Promise<{
    success: boolean
    output: Output | null
  }>
}

export type TypedTask<I, O> = BaseTask<I, O>
export interface TaskList {
  id: number
  tasks: any[]
  type: `sequential` | `parallel`
}
