import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { plannerSlotsPath } from '../lib/firestorePaths'
import type { PlannerSlot } from '../types/planner'

export function listenToPlannerSlots(
  onChange: (slots: PlannerSlot[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, plannerSlotsPath()), (snapshot) => {
    const slots = snapshot.docs.map((document) => {
      const data = document.data()

      return {
        id: document.id,
        day: data.day,
        meal: data.meal,
        type: data.type,
        menuId: data.menuId,
        eventTitle: data.eventTitle,
        people: data.people,
        notes: data.notes,
      } satisfies PlannerSlot
    })

    onChange(slots)
  })
}

export async function savePlannerSlot(slot: PlannerSlot) {
  await setDoc(doc(db, plannerSlotsPath(), slot.id), {
    day: slot.day,
    meal: slot.meal,
    type: slot.type,
    menuId: slot.menuId ?? null,
    eventTitle: slot.eventTitle ?? null,
    people: slot.people,
    notes: slot.notes ?? null,
  })
}