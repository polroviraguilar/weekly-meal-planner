import { useEffect, useState } from 'react'
import type { Menu, Person, PlannerSlot } from '../types/planner'
import { personLabels } from '../data/plannerConstants'
import { MenuFormModal } from './MenuFormModal'

type MealSlotModalProps = {
  slot: PlannerSlot
  menus: Menu[]
  onClose: () => void
  onSave: (slot: PlannerSlot) => void | Promise<void>
  onAddMenu: (menu: Menu) => void | Promise<void>
  onEditMenu: (menu: Menu) => void | Promise<void>
  onDeleteMenu: (menuId: string) => void | Promise<void>
}

export function MealSlotModal({
  slot,
  menus,
  onClose,
  onSave,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
}: MealSlotModalProps) {
  const [selectedMode, setSelectedMode] = useState<'menu' | 'event' | 'empty'>(
    slot.type,
  )
  const [selectedMenuId, setSelectedMenuId] = useState(slot.menuId ?? '')
  const [eventTitle, setEventTitle] = useState(slot.eventTitle ?? '')
  const [people, setPeople] = useState<Person>(slot.people)
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  async function handleSave() {
    if (selectedMode === 'menu') {
      if (!selectedMenuId) return

      await onSave({
        ...slot,
        type: 'menu',
        menuId: selectedMenuId,
        eventTitle: undefined,
        people,
      })

      return
    }

    if (selectedMode === 'event') {
      const cleanTitle = eventTitle.trim()

      if (!cleanTitle) return

      await onSave({
        ...slot,
        type: 'event',
        menuId: undefined,
        eventTitle: cleanTitle,
        people,
      })

      return
    }

    await onSave({
      ...slot,
      type: 'empty',
      menuId: undefined,
      eventTitle: undefined,
      people,
      notes: undefined,
    })
  }

  const isSaveDisabled =
    (selectedMode === 'menu' && !selectedMenuId) ||
    (selectedMode === 'event' && !eventTitle.trim())

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-md sm:items-center"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/80 bg-white p-5 shadow-2xl shadow-slate-950/20"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Editar àpat
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Què menjareu?
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setSelectedMode('menu')}
              className={[
                'rounded-xl px-3 py-2 text-sm font-bold transition',
                selectedMode === 'menu'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500',
              ].join(' ')}
            >
              Menú
            </button>

            <button
              onClick={() => setSelectedMode('event')}
              className={[
                'rounded-xl px-3 py-2 text-sm font-bold transition',
                selectedMode === 'event'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500',
              ].join(' ')}
            >
              Esdeveniment
            </button>

            <button
              onClick={() => setSelectedMode('empty')}
              className={[
                'rounded-xl px-3 py-2 text-sm font-bold transition',
                selectedMode === 'empty'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500',
              ].join(' ')}
            >
              Buit
            </button>
          </div>

          {selectedMode === 'menu' && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Selecciona un menú
              </label>

              <button
                onClick={() => setIsMenuFormOpen(true)}
                className="mb-3 w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
              >
                + Crear menú nou
              </button>

              <div className="grid gap-2">
                {menus.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Encara no hi ha cap menú guardat.
                  </p>
                ) : (
                  menus.map((menu) => {
                    const isSelected = selectedMenuId === menu.id

                    return (
                      <div
                        key={menu.id}
                        className={[
                          'rounded-2xl border p-4 transition',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                            : 'border-slate-200 bg-white hover:border-slate-300',
                        ].join(' ')}
                      >
                        <button
                          onClick={() => setSelectedMenuId(menu.id)}
                          className="w-full text-left"
                        >
                          <p className="font-bold text-slate-900">
                            {menu.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {menu.dishes.join(' · ')}
                          </p>

                          {menu.notes && (
                            <p className="mt-2 text-sm text-slate-600">
                              {menu.notes}
                            </p>
                          )}

                          {menu.tags && menu.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {menu.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => setEditingMenu(menu)}
                          className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200"
                        >
                          Editar menú
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {selectedMode === 'event' && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nom de l’esdeveniment
              </label>

              <input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="Ex: Sopar fora, dinar amb família..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Per a qui és?
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(['pol', 'andrea', 'both'] as Person[]).map((person) => {
                const isSelected = people === person

                return (
                  <button
                    key={person}
                    onClick={() => setPeople(person)}
                    className={[
                      'rounded-2xl border px-3 py-3 text-sm font-bold transition',
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600',
                    ].join(' ')}
                  >
                    {personLabels[person]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
            >
              Cancel·lar
            </button>

            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={[
                'flex-1 rounded-2xl px-4 py-3 text-sm font-bold shadow-sm transition',
                isSaveDisabled
                  ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-emerald-600 text-white',
              ].join(' ')}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {isMenuFormOpen && (
        <MenuFormModal
          onClose={() => setIsMenuFormOpen(false)}
          onSave={async (newMenu) => {
            await onAddMenu(newMenu)
            setSelectedMenuId(newMenu.id)
            setSelectedMode('menu')
            setIsMenuFormOpen(false)
          }}
        />
      )}

      {editingMenu && (
        <MenuFormModal
          menu={editingMenu}
          onClose={() => setEditingMenu(null)}
          onSave={async (updatedMenu) => {
            await onEditMenu(updatedMenu)
            setEditingMenu(null)
          }}
          onDelete={async (menuId) => {
            await onDeleteMenu(menuId)

            if (selectedMenuId === menuId) {
              setSelectedMenuId('')
            }

            setEditingMenu(null)
          }}
        />
      )}
    </>
  )
}