import {
  collection,
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
import { shoppingItemsPath } from '../lib/firestorePaths'
import type { ShoppingItem } from '../types/planner'

export function listenToShoppingItems(
  onChange: (items: ShoppingItem[]) => void,
): Unsubscribe {
  const itemsQuery = query(
    collection(db, shoppingItemsPath()),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(itemsQuery, (snapshot) => {
    const items = snapshot.docs.map((document) => {
      const data = document.data()

      return {
        id: document.id,
        text: data.text,
        checked: data.checked ?? false,
      } satisfies ShoppingItem
    })

    onChange(items)
  })
}

export async function saveShoppingItem(item: ShoppingItem) {
  await setDoc(doc(db, shoppingItemsPath(), item.id), {
    text: item.text,
    checked: item.checked,
    createdAt: serverTimestamp(),
    checkedAt: null,
  })
}

export async function markShoppingItemAsBoughtInFirestore(itemId: string) {
  await updateDoc(doc(db, shoppingItemsPath(), itemId), {
    checked: true,
    checkedAt: serverTimestamp(),
  })
}