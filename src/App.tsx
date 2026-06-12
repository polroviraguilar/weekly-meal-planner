import { MealPlanner } from './components/MealPlanner'
import { MobileBottomNav } from './components/MobileBottomNav'
import { ShoppingList } from './components/ShoppingList'
import { useFirebasePlannerData } from './hooks/useFirebasePlannerData'

export default function App() {
  const {
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
  } = useFirebasePlannerData()

  const pendingShoppingItems = shoppingItems.filter((item) => !item.checked)

  return (
    <main className="min-h-screen px-4 pb-28 pt-5 text-slate-950 sm:px-6 sm:pb-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl shadow-emerald-950/10">
          <div className="relative isolate px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.55),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(251,146,60,0.38),transparent_24rem),linear-gradient(135deg,#064e3b,#0f766e_45%,#0f172a)]" />

            <div className="absolute right-6 top-6 hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur md:block">
              Pol & Andrea
            </div>

            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-50 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                Setmana organitzada
              </div>

              <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Menús, plans i compra en un sol lloc.
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-emerald-50/90 sm:text-lg">
                Planifiqueu dinars i sopars, guardeu els vostres menús preferits
                i manteniu la llista de la compra sempre a punt.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#planner"
                  className="rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-50 active:translate-y-0"
                >
                  Veure setmana
                </a>

                <a
                  href="#shopping"
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0"
                >
                  Llista de la compra
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                <p className="text-3xl font-black">14</p>
                <p className="mt-1 text-sm font-medium text-white/75">
                  àpats setmanals
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                <p className="text-3xl font-black">{menus.length}</p>
                <p className="mt-1 text-sm font-medium text-white/75">
                  menús guardats
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                <p className="text-3xl font-black">
                  {pendingShoppingItems.length}
                </p>
                <p className="mt-1 text-sm font-medium text-white/75">
                  coses pendents
                </p>
              </div>
            </div>
          </div>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            <p className="font-black">Error connectant amb Firebase</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <section id="planner" className="scroll-mt-6">
            {isLoading ? (
              <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
                <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-4 grid gap-3">
                  <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                  <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                  <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                </div>
              </div>
            ) : (
              <MealPlanner
                slots={plannerSlots}
                menus={menus}
                onUpdateSlot={updatePlannerSlot}
                onAddMenu={addMenu}
                onEditMenu={editMenu}
                onDeleteMenu={removeMenu}
              />
            )}
          </section>

          <aside
            id="shopping"
            className="scroll-mt-6 xl:sticky xl:top-6 xl:self-start"
          >
            <ShoppingList
              items={shoppingItems}
              onAddItem={addShoppingItem}
              onMarkAsBought={markShoppingItemAsBought}
            />
          </aside>
        </div>
      </div>

      <MobileBottomNav pendingShoppingItemsCount={pendingShoppingItems.length} />
    </main>
  )
}