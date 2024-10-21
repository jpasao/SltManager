import { api } from '../adapters/api'

const collectionResource = 'Collection'

export const getCollections = (nameObj) =>
  api.post(`${collectionResource}/Get`, nameObj).then((data) => data.json())

export const createCollection = (collectionObj) =>
  api.post(`${collectionResource}/Post`, collectionObj).then((data) => data.json())

export const updateCollection = (collectionObj) =>
  api.put(collectionResource, collectionObj).then((data) => data.json())

export const deleteCollection = (collectionId) =>
  api.delete(`${collectionResource}?id=${collectionId}`)
