import { useEffect, useState } from 'react'
import type { Menu } from '../types/planner'

type MenuFormModalProps = {
  menu?: Menu
  onClose: () => void
  onSave: (menu: Menu) => void | Promise<void>
  onDelete?: (menuId: string) => void | Promise<void>
}

export function MenuFormModal({
  menu,
  onClose,
  onSave,
  onDelete,
}: MenuFormModalProps) {
  const isEditing = Boolean(menu)

  const [title, setTitle] = useState(menu?.title ?? '')
  const [dishInput, setDishInput] = useState('')
  const [dishes, setDishes] = useState<string[]>(menu?.dishes ?? [])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(menu?.tags ?? [])
  const [notes, setNotes] = useState(menu?.notes ?? '')
  const [isDeleting, setIsDeleting] = useState(false)

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

  function addDish() {
    const cleanDish = dishInput.trim()

    if (!cleanDish) return

    setDishes((currentDishes) => [...currentDishes, cleanDish])
    setDishInput('')
  }

  function removeDish(dishToRemove: string) {
    setDishes((currentDishes) =>
      currentDishes.filter((dish) => dish !== dishToRemove),
    )
  }

  function addTag() {
    const cleanTag = tagInput.trim()

    if (!cleanTag) return

    setTags((currentTags) => {
      if (currentTags.includes(cleanTag)) {
        return currentTags
      }

      return [...currentTags, cleanTag]
    })

    setTagInput('')
  }

  function removeTag(tagToRemove: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove))
  }

  async function handleSave() {
    const cleanTitle = title.trim()

    if (!cleanTitle || dishes.length === 0) return

    const savedMenu: Menu = {
      id: menu?.id ?? crypto.randomUUID(),
      title: cleanTitle,
      dishes,
      tags,
      notes: notes.trim() || undefined,
    }

    await onSave(savedMenu)
  }

  async function handleDelete() {
    if (!menu || !onDelete) return

    const confirmed = window.confirm(
      `Segur que vols eliminar el menú "${menu.title}"? Si està assignat a algun àpat, aquell àpat quedarà buit.`,
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      await onDelete(menu.id)
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  const isSaveDisabled = !title.trim() || dishes.length === 0

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/80 bg-white p-5 shadow-2xl shadow-slate-950/20"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              {isEditing ? 'Editar menú' : 'Nou menú'}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {isEditing ? 'Modificar menú' : 'Afegir menú al repositori'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Nom del menú
          </label>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Pasta pesto, Pollastre amb arròs..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Plats
          </label>

          <div className="mb-3 flex gap-2">
            <input
              value={dishInput}
              onChange={(event) => setDishInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addDish()
                }
              }}
              placeholder="Ex: Pasta amb pesto"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              onClick={addDish}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              Afegir
            </button>
          </div>

          {dishes.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
              Encara no has afegit cap plat.
            </p>
          ) : (
            <div className="grid gap-2">
              {dishes.map((dish) => (
                <div
                  key={dish}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {dish}
                  </span>

                  <button
                    onClick={() => removeDish(dish)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm"
                  >
                    Treure
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Notes opcionals
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex: comprar salsa extra, fer-ne doble ració..."
            className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Tags opcionals
          </label>

          <div className="mb-3 flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addTag()
                }
              }}
              placeholder="Ex: ràpid, healthy, batch cooking..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              onClick={addTag}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
            >
              Afegir
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                >
                  {tag} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {isEditing && onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100"
            >
              {isDeleting ? 'Eliminant...' : 'Eliminar menú'}
            </button>
          )}

          <div className="flex flex-1 gap-2">
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
              {isEditing ? 'Guardar canvis' : 'Guardar menú'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}