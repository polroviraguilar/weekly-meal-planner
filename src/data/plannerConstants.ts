import type { MealType, Person, WeekDay } from '../types/planner'

export const weekDays: { id: WeekDay; label: string }[] = [
  { id: 'monday', label: 'Dilluns' },
  { id: 'tuesday', label: 'Dimarts' },
  { id: 'wednesday', label: 'Dimecres' },
  { id: 'thursday', label: 'Dijous' },
  { id: 'friday', label: 'Divendres' },
  { id: 'saturday', label: 'Dissabte' },
  { id: 'sunday', label: 'Diumenge' },
]

export const meals: { id: MealType; label: string }[] = [
  { id: 'lunch', label: 'Dinar' },
  { id: 'dinner', label: 'Sopar' },
]

export const personLabels: Record<Person, string> = {
  pol: 'Pol',
  andrea: 'Andrea',
  both: 'Tots dos',
}