import { useEffect, useState } from 'react'
import * as collectionService from '../services/collection'
import { returnResponse } from '../../defaults/global'

export const useGetCollections = (collectionObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await collectionService.getCollections(collectionObject).then((response) => {
        setIsLoading(false)
        setCollections(returnResponse(response))
      })
    }
    getData()
  }, [refresh])

  const refreshCollections = () => {
    setRefresh(!refresh)
  }
  return { collections, refreshCollections, isLoading }
}

export const useCreateCollection = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createCollection = async (collectionObject) => {
    setIsLoading(true)
    return await collectionService.createCollection(collectionObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { createCollection, isLoading }
}

export const useUpdateCollection = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updateCollection = async (collectionObject) => {
    setIsLoading(true)
    return await collectionService.updateCollection(collectionObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { updateCollection, isLoading }
}

export const useDeleteCollection = () => {
  const [isLoading, setIsLoading] = useState(false)

  const deleteCollection = async (collectionId) => {
    setIsLoading(true)
    return await collectionService.deleteCollection(collectionId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { deleteCollection, isLoading }
}

export const useGetDependencies = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getDependencies = async (collectionId) => {
    setIsLoading(true)
    return await collectionService.getDependencies(collectionId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { getDependencies, isLoading }
}
