import { api } from '../adapters/api'

const modelResource = 'StlModel'

export const getModels = (nameObj) => api.post(`${modelResource}/Get`, nameObj)

export const createModel = (modelObj) => api.post(`${modelResource}/Post`, modelObj)

export const updateModel = (modelObj) => api.put(modelResource, modelObj)

export const deleteModel = (modelId) => api.delete(`${modelResource}?id=${modelId}`)

export const createPhoto = (photo, modelId, photoId) =>
  api.post(`${modelResource}/Photo?id=${modelId}&idPhoto=${photoId}`, photo)

export const updatePhoto = (photo, modelId, photoId) =>
  api.put(`${modelResource}/Photo?id=${modelId}&idPhoto=${photoId}`, photo)
