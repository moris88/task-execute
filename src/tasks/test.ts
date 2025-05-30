import { info, TypedTask } from '@/lib'

type Input = {}
type Output = {}

export const test: TypedTask<Input, Output> = {
  name: 'test',
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
