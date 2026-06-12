import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { householdPath, plannerSlotsPath } from '../lib/firestorePaths'
import { mockPlannerSlots } from '../data/mockData'

export async function bootstrapHouseholdIfNeeded() {
  const householdRef = doc(db, householdPath())
  const householdSnapshot = await getDoc(householdRef)

  if (householdSnapshot.exists()) {
    return
  }

  await setDoc(householdRef, {
    name: 'Pol & Andrea',
    createdAt: new Date().toISOString(),
  })

  await Promise.all(
    mockPlannerSlots.map((slot) =>
      setDoc(doc(db, plannerSlotsPath(), slot.id), {
        day: slot.day,
        meal: slot.meal,
        type: slot.type,
        menuId: slot.menuId ?? null,
        eventTitle: slot.eventTitle ?? null,
        people: slot.people,
        notes: slot.notes ?? null,
      }),
    ),
  )
}