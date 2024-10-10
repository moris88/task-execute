import { Task } from '@/types'
import axios from 'axios'

const task1: Task = async () => {
  return axios
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .then((res) => ({ name: 'task1', output: res.data }))
}

export default task1