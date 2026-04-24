import { useMemo } from 'react'

export function useOBSMode(): boolean {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('obs') === 'true'
  }, [])
}
