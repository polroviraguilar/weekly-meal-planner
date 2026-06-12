import { useEffect, useState } from 'react'
import type { Menu, PlannerSlot, ShoppingItem } from '../types/planner'
import {
  clearMenuFromPlannerSlot,
  deleteMenu,
  listenToMenus,
  saveMenu,
  updateMenu,
} from '../services/menuService'
import {
  listenToPlannerSlots,
  savePlannerSlot,
} from '../services/plannerService'
import {
  listenToShoppingItems,
  markShoppingItemAsBoughtInFirestore,
  saveShoppingItem,
} from '../services/shoppingService'
import { bootstrapHouseholdIfNeeded } from '../services/bootstrapService'

export function useFirebasePlannerData() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [plannerSlots, setPlannerSlots] = useState<PlannerSlot[]>([])
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let didCancel = false
    let cleanup: undefined | (() => void)

    async function start() {
      try {
        await bootstrapHouseholdIfNeeded()

        if (didCancel) return

        const unsubscribeMenus = listenToMenus(setMenus)
        const unsubscribePlannerSlots = listenToPlannerSlots(setPlannerSlots)
        const unsubscribeShoppingItems = listenToShoppingItems(setShoppingItems)

        cleanup = () => {
          unsubscribeMenus()
          unsubscribePlannerSlots()
          unsubscribeShoppingItems()
        }

        setErrorMessage(null)
      } catch (error) {
        console.error(error)

        if (!didCancel) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Error desconegut connectant amb Firebase',
          )
        }
      } finally {
        if (!didCancel) {
          setIsLoading(false)
        }
      }
    }

    void start()

    return () => {
      didCancel = true

      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  async function addMenu(newMenu: Menu) {
    await saveMenu(newMenu)
  }

  async function editMenu(updatedMenu: Menu) {
    await updateMenu(updatedMenu)
  }

  async function removeMenu(menuId: string) {
    const slotsUsingMenu = plannerSlots.filter((slot) => slot.menuId === menuId)

    await Promise.all([
      ...slotsUsingMenu.map((slot) => clearMenuFromPlannerSlot(slot.id)),
      deleteMenu(menuId),
    ])
  }

  async function updatePlannerSlot(updatedSlot: PlannerSlot) {
    await savePlannerSlot(updatedSlot)
  }

  async function addShoppingItem(text: string) {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      text,
      checked: false,
    }

    await saveShoppingItem(newItem)
  }

  async function markShoppingItemAsBought(itemId: string) {
    await markShoppingItemAsBoughtInFirestore(itemId)
  }

  return {
    menus,
    plannerSlots,
    shoppingItems,
    isLoading,
    errorMessage,
    addMenu,
    editMenu,
    removeMenu,
    updatePlannerSlot,
    addShoppingItem,
    markShoppingItemAsBought,
  }
}