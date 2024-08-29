import { api } from '../adapters/api'

const modelResource = 'StlModel'

export const getModels = (modelObj) =>
  api.post(`${modelResource}/Get`, modelObj).then((data) => data.json())

export const openFolder = (modelObj) => api.post(`${modelResource}/OpenFolder`, modelObj)

export const getModelYears = () =>
  api.get(`${modelResource}/ModelYears`).then((data) => data.json())

export const createModel = (modelObj) =>
  api.post(`${modelResource}/Post`, modelObj).then((data) => data.json())

export const updateModel = (modelObj) =>
  api.put(modelResource, modelObj).then((data) => data.json())

export const deleteModel = (modelId) => api.delete(`${modelResource}?id=${modelId}`)

export const getPhotos = (modelId) =>
  api.get(`${modelResource}/Photo?id=${modelId}`).then((data) => data.json())

export const createPhoto = (photo, modelId, photoId) =>
  api
    .post(`${modelResource}/Photo?id=${modelId}&idPhoto=${photoId}`, photo)
    .then((data) => data.json())

export const updatePhoto = (photo, modelId, photoId) =>
  api
    .put(`${modelResource}/Photo?id=${modelId}&idPhoto=${photoId}`, photo)
    .then((data) => data.json())
