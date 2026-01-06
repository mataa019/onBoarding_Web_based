import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { portfolioApi } from '../ApiService/portfolioApi'
import type { Portfolio, Experience, Education, Skill, Reference } from '../ApiService/types'

type PortfolioResourceValue = {
  portfolio: Portfolio | null
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  references: Reference[]
  isFetching: boolean
  error: string | null
  refresh: () => Promise<void>
}

const PortfolioResourceContext = createContext<PortfolioResourceValue | undefined>(undefined)

interface PortfolioResourceProviderProps {
  children: ReactNode
  initialPortfolio?: Portfolio | null  // Pass existing portfolio to avoid re-fetching
}

export function PortfolioResourceProvider({ initialPortfolio, children }: PortfolioResourceProviderProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(initialPortfolio || null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync with initialPortfolio when it changes
  useEffect(() => {
    if (initialPortfolio) {
      setPortfolio(initialPortfolio)
    }
  }, [initialPortfolio])

  const fetchPortfolio = async () => {
    console.debug('[usePortfolioResource] fetchPortfolio')
    setIsFetching(true)
    setError(null)
    try {
      // Always use the current user's portfolio endpoint (no username needed)
      const data = await portfolioApi.get()
      console.debug('[usePortfolioResource] fetched portfolio:', data)
      setPortfolio(data)
    } catch (err) {
      console.error('Failed to fetch portfolio resource:', err)
      setError((err as any)?.message || 'Failed to load portfolio')
    } finally {
      setIsFetching(false)
    }
  }

  const refresh = async () => {
    await fetchPortfolio()
  }

  const value: PortfolioResourceValue = {
    portfolio,
    experiences: portfolio?.experiences || [],
    education: portfolio?.education || [],
    skills: portfolio?.skills || [],
    references: portfolio?.references || [],
    isFetching,
    error,
    refresh,
  }

  return <PortfolioResourceContext.Provider value={value}>{children}</PortfolioResourceContext.Provider>
}

export function usePortfolioResource() {
  const ctx = useContext(PortfolioResourceContext)
  if (!ctx) throw new Error('usePortfolioResource must be used within a PortfolioResourceProvider')
  return ctx
}
