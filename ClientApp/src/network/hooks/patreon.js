import { useEffect, useState } from 'react'
import * as patreonService from '../services/patreon'
import { returnResponse } from '../../defaults/global'

export const useGetPatreons = (patreonObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [patreons, setPatreons] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await patreonService.getPatreons(patreonObject).then((response) => {
        setPatreons(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshPatreons = () => {
    setRefresh(!refresh)
  }
  return { patreons, refreshPatreons, isLoading }
}

export const useCreatePatreon = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createPatreon = async (patreonObject) => {
    setIsLoading(true)
    return await patreonService.createPatreon(patreonObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { createPatreon, isLoading }
}

export const useUpdatePatreon = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updatePatreon = async (patreonObject) => {
    setIsLoading(true)
    return await patreonService.updatePatreon(patreonObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { updatePatreon, isLoading }
}

export const useDeletePatreon = () => {
  const [isLoading, setIsLoading] = useState(false)

  const deletePatreon = async (patreonId) => {
    setIsLoading(true)
    return await patreonService.deletePatreon(patreonId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { deletePatreon, isLoading }
}

export const useGetDependencies = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getDependencies = async (patreonId) => {
    setIsLoading(true)
    return await patreonService.getDependencies(patreonId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { getDependencies, isLoading }
}
