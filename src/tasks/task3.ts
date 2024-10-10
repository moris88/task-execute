import { Task } from "@/types"

const task3: Task = async (input) => {
  console.log('Task 3 eseguito con input:', input)
  return { name: 'task3', output: true } // Funzione sincrona
}

export default task3
