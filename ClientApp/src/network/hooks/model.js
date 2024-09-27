import { useState, useEffect } from 'react'
import * as modelService from '../services/model'

export const useGetModels = (modelObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    modelService.getModels(modelObject).then((models) => {
      setModels(models)
      setIsLoading(false)
    })
  }, [refresh])

  const refreshModels = () => {
    setRefresh(!refresh)
  }

  return { models, refreshModels, isLoading }
}

export const useGetModelYears = () => {
  const modelYears = () => {
    return modelService.getModelYears()
  }
  return { modelYears }
}

export const useOpenFolder = () => {
  const openFolder = (path) => {
    return modelService.openFolder(path)
  }
  return { openFolder }
}

export const useCreateModel = () => {
  const createModel = (modelObject) => {
    return modelService.createModel(modelObject)
  }
  return { createModel }
}

export const useUpdateModel = () => {
  const updateModel = (modelObject) => {
    return modelService.updateModel(modelObject)
  }
  return { updateModel }
}

export const useDeleteModel = () => {
  const deleteModel = (modelId) => modelService.deleteModel(modelId)

  return { deleteModel }
}

export const useGetPhotos = () => {
  const getPhotos = (modelId) => {
    return modelService.getPhotos(modelId)
  }
  return { getPhotos }
}

export const useCreatePhoto = () => {
  const createPhoto = (photo, modelId) => {
    return modelService.createPhoto(photo, modelId)
  }
  return { createPhoto }
}

export const useDeletePhoto = () => {
  const deletePhoto = (photoId) => {
    return modelService.deletePhoto(photoId)
  }
  return { deletePhoto }
}
