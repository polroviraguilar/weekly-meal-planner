import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { menusPath, plannerSlotsPath } from '../lib/firestorePaths'
import type { Menu } from '../types/planner'

export function listenToMenus(
  onChange: (menus: Menu[]) => void,
): Unsubscribe {
  const menusQuery = query(
    collection(db, menusPath()),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(menusQuery, (snapshot) => {
    const menus = snapshot.docs.map((document) => {
      const data = document.data()

      return {
        id: document.id,
        title: data.title,
        dishes: data.dishes ?? [],
        notes: data.notes,
        tags: data.tags ?? [],
      } satisfies Menu
    })

    onChange(menus)
  })
}

export async function saveMenu(menu: Menu) {
  await setDoc(
    doc(db, menusPath(), menu.id),
    {
      title: menu.title,
      dishes: menu.dishes,
      notes: menu.notes ?? null,
      tags: menu.tags ?? [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function updateMenu(menu: Menu) {
  await updateDoc(doc(db, menusPath(), menu.id), {
    title: menu.title,
    dishes: menu.dishes,
    notes: menu.notes ?? null,
    tags: menu.tags ?? [],
    updatedAt: serverTimestamp(),
  })
}

export async function deleteMenu(menuId: string) {
  await deleteDoc(doc(db, menusPath(), menuId))
}

export async function clearMenuFromPlannerSlot(slotId: string) {
  await updateDoc(doc(db, plannerSlotsPath(), slotId), {
    type: 'empty',
    menuId: null,
    eventTitle: null,
    notes: null,
  })
}