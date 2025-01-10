import { Task } from '@/types'

const task2: Task = async () => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Errore nel task 2`)), 500)
  )
}

export default task2
