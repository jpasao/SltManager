import { post, put, deleteItem } from '../adapters/api'

const collectionResource = 'Collection'

export const getCollections = async (nameObj) => await post(`${collectionResource}/Get`, nameObj)

export const createCollection = async (collectionObj) =>
  await post(`${collectionResource}/Post`, collectionObj)

export const updateCollection = async (collectionObj) =>
  await put(collectionResource, collectionObj)

export const deleteCollection = async (collectionId) =>
  await deleteItem(`${collectionResource}?id=${collectionId}`)
