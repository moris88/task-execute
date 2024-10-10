export interface OutputTask {
  name: string
  output: any
}

export interface InputTask {
  args: any | null
  results: OutputTask[]
}

export type Task = (
  inputTask?: Partial<InputTask> | null
) => Promise<OutputTask> | OutputTask
