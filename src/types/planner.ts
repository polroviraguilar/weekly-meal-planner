export type Person = 'pol' | 'andrea' | 'both'

export type MealType = 'lunch' | 'dinner'

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type PlannerSlotType = 'empty' | 'menu' | 'event'

export type Menu = {
  id: string
  title: string
  dishes: string[]
  notes?: string
  tags?: string[]
}

export type PlannerSlot = {
  id: string
  day: WeekDay
  meal: MealType
  type: PlannerSlotType
  menuId?: string
  eventTitle?: string
  people: Person
  notes?: string
}

export type ShoppingItem = {
  id: string
  text: string
  checked: boolean
}