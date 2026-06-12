import { useEffect, useState } from 'react'
import { cn } from '../utils/cn'

type ActiveSection = 'planner' | 'shopping'

type MobileBottomNavProps = {
  pendingShoppingItemsCount: number
}

export function MobileBottomNav({
  pendingShoppingItemsCount,
}: MobileBottomNavProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('planner')

  useEffect(() => {
    const plannerElement = document.getElementById('planner')
    const shoppingElement = document.getElementById('shopping')

    if (!plannerElement || !shoppingElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const mostVisibleEntry = visibleEntries[0]

        if (!mostVisibleEntry) return

        if (mostVisibleEntry.target.id === 'planner') {
          setActiveSection('planner')
        }

        if (mostVisibleEntry.target.id === 'shopping') {
          setActiveSection('shopping')
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-20% 0px -55% 0px',
      },
    )

    observer.observe(plannerElement)
    observer.observe(shoppingElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  function scrollToSection(sectionId: ActiveSection) {
    const element = document.getElementById(sectionId)

    if (!element) return

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    setActiveSection(sectionId)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-[1.5rem] border border-white/80 bg-white/90 p-2 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <button
          onClick={() => scrollToSection('planner')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-black transition',
            activeSection === 'planner'
              ? 'bg-slate-950 text-white shadow-lg shadow-slate-300'
              : 'text-slate-500 hover:bg-slate-100',
          )}
        >
          <span>Setmana</span>
        </button>

        <button
          onClick={() => scrollToSection('shopping')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-black transition',
            activeSection === 'shopping'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              : 'text-slate-500 hover:bg-slate-100',
          )}
        >
          <span>Compra</span>

          {pendingShoppingItemsCount > 0 && (
            <span
              className={cn(
                'flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-black',
                activeSection === 'shopping'
                  ? 'bg-white text-emerald-700'
                  : 'bg-emerald-100 text-emerald-700',
              )}
            >
              {pendingShoppingItemsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}