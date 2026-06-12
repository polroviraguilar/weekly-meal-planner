import { useState } from 'react'
import type { Menu, PlannerSlot } from '../types/planner'
import { meals, personLabels, weekDays } from '../data/plannerConstants'
import { MealSlotModal } from './MealSlotModal'
import { MenuFormModal } from './MenuFormModal'
import { MenuManagerModal } from './MenuManagerModal'
import { getPersonBadgeClasses } from '../utils/personStyles'
import { cn } from '../utils/cn'

type MealPlannerProps = {
  slots: PlannerSlot[]
  menus: Menu[]
  onUpdateSlot: (slot: PlannerSlot) => void | Promise<void>
  onAddMenu: (menu: Menu) => void | Promise<void>
  onEditMenu: (menu: Menu) => void | Promise<void>
  onDeleteMenu: (menuId: string) => void | Promise<void>
}

export function MealPlanner({
  slots,
  menus,
  onUpdateSlot,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
}: MealPlannerProps) {
  const [editingSlot, setEditingSlot] = useState<PlannerSlot | null>(null)
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false)
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false)

  function getSlot(dayId: string, mealId: string) {
    return slots.find((slot) => slot.day === dayId && slot.meal === mealId)
  }

  function getMenu(menuId?: string) {
    if (!menuId) return null
    return menus.find((menu) => menu.id === menuId) ?? null
  }

  async function handleSaveSlot(updatedSlot: PlannerSlot) {
    await onUpdateSlot(updatedSlot)
    setEditingSlot(null)
  }

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
                Planner
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                Aquesta setmana
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Toca qualsevol àpat per assignar un menú o afegir un pla.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsMenuManagerOpen(true)}
                className="rounded-full bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-200 active:translate-y-0"
              >
                Gestionar menús
              </button>

              <button
                onClick={() => setIsMenuFormOpen(true)}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0"
              >
                + Afegir menú
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          {weekDays.map((day) => (
            <article
              key={day.id}
              className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-3 transition hover:border-emerald-100 hover:bg-emerald-50/30"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  {day.label}
                </h3>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-400 shadow-sm ring-1 ring-slate-200">
                  Dinar · Sopar
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {meals.map((meal) => {
                  const slot = getSlot(day.id, meal.id)

                  if (!slot) return null

                  const menu = getMenu(slot.menuId)

                  return (
                    <button
                      key={`${day.id}-${meal.id}`}
                      onClick={() => setEditingSlot(slot)}
                      className={cn(
                        'group relative min-h-40 overflow-hidden rounded-[1.5rem] bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition duration-200',
                        'hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80 hover:ring-emerald-200 active:translate-y-0',
                        slot.type === 'menu' &&
                          'bg-gradient-to-br from-white to-emerald-50/70',
                        slot.type === 'event' &&
                          'bg-gradient-to-br from-white to-violet-50/80',
                      )}
                    >
                      <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                          Editar
                        </span>
                      </div>

                      <div className="mb-4 flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide',
                            meal.id === 'lunch'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-indigo-100 text-indigo-700',
                          )}
                        >
                          {meal.label}
                        </span>

                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-black',
                            getPersonBadgeClasses(slot.people),
                          )}
                        >
                          {personLabels[slot.people]}
                        </span>
                      </div>

                      {slot.type === 'empty' ? (
                        <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-black text-slate-400 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                          + Assignar àpat
                        </div>
                      ) : slot.type === 'menu' ? (
                        <div>
                          <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
                            Menú
                          </p>

                          <h4 className="text-xl font-black leading-tight text-slate-950">
                            {menu?.title ?? 'Menú eliminat'}
                          </h4>

                          {menu?.dishes && menu.dishes.length > 0 && (
                            <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                              {menu.dishes.join(' · ')}
                            </p>
                          )}

                          {menu?.tags && menu.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {menu.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-violet-600">
                            Pla
                          </p>

                          <h4 className="text-xl font-black leading-tight text-slate-950">
                            {slot.eventTitle}
                          </h4>

                          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                            Aquest àpat queda reservat per un esdeveniment.
                          </p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {editingSlot && (
        <MealSlotModal
          slot={editingSlot}
          menus={menus}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
          onAddMenu={onAddMenu}
          onEditMenu={onEditMenu}
          onDeleteMenu={onDeleteMenu}
        />
      )}

      {isMenuFormOpen && (
        <MenuFormModal
          onClose={() => setIsMenuFormOpen(false)}
          onSave={async (newMenu) => {
            await onAddMenu(newMenu)
            setIsMenuFormOpen(false)
          }}
        />
      )}

      {isMenuManagerOpen && (
        <MenuManagerModal
          menus={menus}
          onClose={() => setIsMenuManagerOpen(false)}
          onEditMenu={onEditMenu}
          onDeleteMenu={onDeleteMenu}
        />
      )}
    </>
  )
}