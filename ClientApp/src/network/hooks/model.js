import { useState } from 'react'
import * as modelService from '../services/model'

export const useGetModels = () => {
  const [models, setModels] = useState([])

  const getModels = (modelObject) => {
    return modelService.getModels(modelObject).then(({ models }) => {
      setModels(models)
    })
  }
  return { getModels }
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
  const deleteModel = (modelObject) => {
    return modelService.deleteModel(modelObject)
  }
  return { deleteModel }
}
