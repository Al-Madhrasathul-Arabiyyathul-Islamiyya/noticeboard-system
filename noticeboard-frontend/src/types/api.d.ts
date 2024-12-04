interface Schedule {
  id: number
  type: 'academic' | 'administration'
  date: string
  time: string
  item: string
}

interface Countdown {
  id: number
  name: string
  targetDate: string
  active: boolean
}

interface Video {
  id: number
  filename: string
  path: string
  order: number
  active: boolean
  createdAt: string
}

interface ApiError {
  message: string
  status?: number
}
