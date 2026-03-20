import { useState, useEffect, useCallback } from 'react'

export default function useFetch(fetchFn) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetchFn()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [])

  return { data, loading, error, refetch: load }
}
