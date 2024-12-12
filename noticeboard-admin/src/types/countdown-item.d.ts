export interface CountdownItem {
  id: number
  name: string
  targetDate: Date
  active: boolean
}

export interface CountdownForm {
  name: string
  targetDate: string
  active: boolean
}
