export interface ScheduleItem {
  id: number
  type: 'academic' | 'administration'
  date: Date
  time: string
  item: string
}
