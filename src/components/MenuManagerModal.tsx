import { useState } from 'react'
import type { Menu } from '../types/planner'
import { MenuFormModal } from './MenuFormModal'

type MenuManagerModalProps = {
  menus: Menu[]
  onClose: () => void
  onEditMenu: (menu: Menu) => void | Promise<void>
  onDeleteMenu: (menuId: string) => void | Promise<void>
}

export function MenuManagerModal({
  menus,
  onClose,
  onEditMenu,
  onDeleteMenu,
}: MenuManagerModalProps) {
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-md sm:items-center"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Repositori
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Gestionar menús
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600"
            >
              ✕
            </button>
          </div>

          {menus.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Encara no hi ha cap menú guardat.
            </p>
          ) : (
            <div className="grid gap-3">
              {menus.map((menu) => (
                <article
                  key={menu.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {menu.title}
                      </h3>

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
                              className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setEditingMenu(menu)}
                      className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                    >
                      Editar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Tancar
          </button>
        </div>
      </div>

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
            setEditingMenu(null)
          }}
        />
      )}
    </>
  )
}