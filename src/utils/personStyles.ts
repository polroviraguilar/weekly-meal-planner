import type { Person } from '../types/planner'

export function getPersonBadgeClasses(person: Person) {
  if (person === 'pol') {
    return 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
  }

  if (person === 'andrea') {
    return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
  }

  return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
}