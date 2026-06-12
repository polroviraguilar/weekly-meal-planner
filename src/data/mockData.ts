import type { Menu, PlannerSlot, ShoppingItem } from '../types/planner'

export const mockMenus: Menu[] = [
  {
    id: 'menu-1',
    title: 'Pasta pesto',
    dishes: ['Pasta amb pesto', 'Amanida verda'],
    tags: ['ràpid', 'vegetarià'],
  },
  {
    id: 'menu-2',
    title: 'Pollastre amb arròs',
    dishes: ['Pollastre a la planxa', 'Arròs basmati', 'Verdures'],
    tags: ['batch cooking'],
  },
  {
    id: 'menu-3',
    title: 'Crema i truita',
    dishes: ['Crema de carbassó', 'Truita francesa'],
    tags: ['lleuger'],
  },
]

export const mockPlannerSlots: PlannerSlot[] = [
  {
    id: 'monday-lunch',
    day: 'monday',
    meal: 'lunch',
    type: 'menu',
    menuId: 'menu-1',
    people: 'both',
  },
  {
    id: 'monday-dinner',
    day: 'monday',
    meal: 'dinner',
    type: 'event',
    eventTitle: 'Sopar fora',
    people: 'both',
  },
  {
    id: 'tuesday-lunch',
    day: 'tuesday',
    meal: 'lunch',
    type: 'menu',
    menuId: 'menu-2',
    people: 'pol',
  },
  {
    id: 'tuesday-dinner',
    day: 'tuesday',
    meal: 'dinner',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'wednesday-lunch',
    day: 'wednesday',
    meal: 'lunch',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'wednesday-dinner',
    day: 'wednesday',
    meal: 'dinner',
    type: 'menu',
    menuId: 'menu-3',
    people: 'andrea',
  },
  {
    id: 'thursday-lunch',
    day: 'thursday',
    meal: 'lunch',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'thursday-dinner',
    day: 'thursday',
    meal: 'dinner',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'friday-lunch',
    day: 'friday',
    meal: 'lunch',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'friday-dinner',
    day: 'friday',
    meal: 'dinner',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'saturday-lunch',
    day: 'saturday',
    meal: 'lunch',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'saturday-dinner',
    day: 'saturday',
    meal: 'dinner',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'sunday-lunch',
    day: 'sunday',
    meal: 'lunch',
    type: 'empty',
    people: 'both',
  },
  {
    id: 'sunday-dinner',
    day: 'sunday',
    meal: 'dinner',
    type: 'empty',
    people: 'both',
  },
]

export const mockShoppingItems: ShoppingItem[] = [
  {
    id: 'item-1',
    text: 'Llet',
    checked: false,
  },
  {
    id: 'item-2',
    text: 'Paper WC',
    checked: false,
  },
  {
    id: 'item-3',
    text: 'Tomàquets',
    checked: false,
  },
]