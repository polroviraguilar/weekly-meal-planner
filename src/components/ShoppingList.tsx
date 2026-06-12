import { useState } from 'react'
import type { ShoppingItem } from '../types/planner'
import { cn } from '../utils/cn'

type ShoppingListProps = {
  items: ShoppingItem[]
  onAddItem: (text: string) => void | Promise<void>
  onMarkAsBought: (itemId: string) => void | Promise<void>
}

export function ShoppingList({
  items,
  onAddItem,
  onMarkAsBought,
}: ShoppingListProps) {
  const [newItemText, setNewItemText] = useState('')
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const visibleItems = items.filter((item) => !item.checked)

  async function addItem() {
    const cleanText = newItemText.trim()

    if (!cleanText) return

    await onAddItem(cleanText)
    setNewItemText('')
  }

  function markAsBought(itemId: string) {
    setRemovingIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(itemId)
      return nextIds
    })

    window.setTimeout(() => {
      void onMarkAsBought(itemId)

      setRemovingIds((currentIds) => {
        const nextIds = new Set(currentIds)
        nextIds.delete(itemId)
        return nextIds
      })
    }, 2000)
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-white to-emerald-50/70 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
              Compra
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Llista
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white shadow-lg shadow-slate-300">
            <p className="text-xl font-black leading-none">
              {visibleItems.length}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/60">
              pendents
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <input
            value={newItemText}
            onChange={(event) => setNewItemText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void addItem()
              }
            }}
            placeholder="Afegir qualsevol cosa..."
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />

          <button
            onClick={() => void addItem()}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0"
          >
            +
          </button>
        </div>
      </div>

      <div className="p-4">
        {visibleItems.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
              ✓
            </div>
            <p className="mt-3 text-sm font-black text-slate-700">
              Tot comprat
            </p>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Quan necessiteu alguna cosa, afegiu-la aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {visibleItems.map((item) => {
              const isRemoving = removingIds.has(item.id)

              return (
                <label
                  key={item.id}
                  className={cn(
                    'group flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-[2000ms]',
                    'hover:border-emerald-200 hover:bg-emerald-50/40',
                    isRemoving
                      ? 'translate-x-4 scale-[0.98] opacity-0'
                      : 'translate-x-0 scale-100 opacity-100',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition',
                      isRemoving
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 bg-white group-hover:border-emerald-400',
                    )}
                  >
                    {isRemoving && <span className="text-xs font-black">✓</span>}
                  </span>

                  <input
                    type="checkbox"
                    checked={isRemoving}
                    onChange={() => markAsBought(item.id)}
                    className="sr-only"
                  />

                  <span
                    className={cn(
                      'text-sm font-bold text-slate-800 transition',
                      isRemoving && 'line-through text-slate-400',
                    )}
                  >
                    {item.text}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}