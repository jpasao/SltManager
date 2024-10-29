import { get, post, postImage, put, deleteItem } from '../adapters/api'

const modelResource = 'StlModel'

export const getModels = async (modelObj) => await post(`${modelResource}/Get`, modelObj)

export const createModel = async (modelObj) => await post(`${modelResource}/Post`, modelObj)

export const updateModel = async (modelObj) => await put(modelResource, modelObj)

export const deleteModel = async (modelId) => await deleteItem(`${modelResource}?id=${modelId}`)

export const getPhotos = async (modelId) => await get(`${modelResource}/Photo?id=${modelId}`)

export const createPhoto = async (photo, modelId) =>
  await postImage(`${modelResource}/Photo?id=${modelId}`, photo)

export const deletePhoto = async (photoId) =>
  await deleteItem(`${modelResource}/Photo?id=${photoId}`)
