import { useEffect, useState } from 'react'
import * as patreonService from '../services/patreon'

export const useGetPatreons = (patreonObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [patreons, setPatreons] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    patreonService.getPatreons(patreonObject).then((patreons) => {
      setPatreons(patreons)
      setIsLoading(false)
    })
  }, [refresh])

  const refreshPatreons = () => {
    setRefresh(!refresh)
  }
  return { patreons, refreshPatreons, isLoading }
}

export const useCreatePatreon = () => {
  const createPatreon = (patreonObject) => {
    return patreonService.createPatreon(patreonObject)
  }
  return { createPatreon }
}

export const useUpdatePatreon = () => {
  const updatePatreon = (patreonObject) => {
    return patreonService.updatePatreon(patreonObject)
  }
  return { updatePatreon }
}

export const useDeletePatreon = () => {
  const deletePatreon = (patreonObject) => patreonService.deletePatreon(patreonObject)

  return { deletePatreon }
}
