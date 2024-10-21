import { useEffect, useState } from 'react'
import * as collectionService from '../services/collection'

export const useGetCollections = (collectionObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    collectionService.getCollections(collectionObject).then((collections) => {
      setCollections(collections)
      setIsLoading(false)
    })
  }, [refresh])

  const refreshCollections = () => {
    setRefresh(!refresh)
  }
  return { collections, refreshCollections, isLoading }
}

export const useCreateCollection = () => {
  const createCollection = (collectionObject) => {
    return collectionService.createCollection(collectionObject)
  }
  return { createCollection }
}

export const useUpdateCollection = () => {
  const updateCollection = (collectionObject) => {
    return collectionService.updateCollection(collectionObject)
  }
  return { updateCollection }
}

export const useDeleteCollection = () => {
  const deleteCollection = (collectionId) => collectionService.deleteCollection(collectionId)

  return { deleteCollection }
}
