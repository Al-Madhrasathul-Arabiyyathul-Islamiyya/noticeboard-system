export interface ScheduleItem {
  id: number
  type: 'academic' | 'administration'
  date: Date | string
  time: string
  item: string
}

export interface ScheduleForm {
  type: 'academic' | 'administration'
  date: string
  time: string
  item: string
}
