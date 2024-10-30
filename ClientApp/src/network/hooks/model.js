import { useState, useEffect } from 'react'
import * as modelService from '../services/model'
import { returnResponse } from '../../defaults/global'

export const useGetModels = (modelObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await modelService.getModels(modelObject).then((response) => {
        setIsLoading(false)
        setModels(returnResponse(response))
      })
    }
    getData()
  }, [refresh])

  const refreshModels = () => {
    setRefresh(!refresh)
  }

  return { models, refreshModels, isLoading }
}

export const useCreateModel = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createModel = async (modelObject) => {
    setIsLoading(true)
    return await modelService.createModel(modelObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { createModel, isLoading }
}

export const useUpdateModel = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updateModel = async (modelObject) => {
    setIsLoading(true)
    return await modelService.updateModel(modelObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { updateModel, isLoading }
}

export const useDeleteModel = () => {
  const [isLoading, setIsLoading] = useState(false)

  const deleteModel = async (modelId) => {
    setIsLoading(true)
    return await modelService.deleteModel(modelId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { deleteModel, isLoading }
}

export const useGetPhotos = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getPhotos = async (modelId) => {
    setIsLoading(true)
    return await modelService.getPhotos(modelId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { getPhotos, isLoading }
}

export const useCreatePhoto = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createPhoto = async (photo, modelId) => {
    setIsLoading(true)
    return await modelService.createPhoto(photo, modelId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { createPhoto, isLoading }
}

export const useDeletePhoto = () => {
  const [isLoading, setIsLoading] = useState(false)

  const deletePhoto = async (photoId) => {
    setIsLoading(true)
    return await modelService.deletePhoto(photoId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { deletePhoto, isLoading }
}

export const useGetDependencies = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getDependencies = async (modelId) => {
    setIsLoading(true)
    return await modelService.getDependencies(modelId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { getDependencies, isLoading }
}
