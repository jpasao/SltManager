import { get, post, put, deleteItem } from '../adapters/api'

const patreonResource = 'Patreon'

export const getPatreons = async (nameObj) => await post(`${patreonResource}/Get`, nameObj)

export const createPatreon = async (patreonObj) => await post(`${patreonResource}/Post`, patreonObj)

export const updatePatreon = async (patreonObj) => await put(patreonResource, patreonObj)

export const deletePatreon = async (patreonId) =>
  await deleteItem(`${patreonResource}?id=${patreonId}`)

export const getDependencies = async (patreonId) =>
  await get(`${patreonResource}/Dependency?id=${patreonId}`)
