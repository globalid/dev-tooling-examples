import axios from 'axios'
import { version } from '../version'

export default axios.create({
  baseURL: 'https://api.global.id',
  headers: {
    'User-Agent': `GlobaliD-API-Client/${version}`
  }
})
