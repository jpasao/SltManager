import { api } from '../adapters/api'

const patreonResource = 'Patreon'

export const getPatreons = (nameObj) =>
  api.post(`${patreonResource}/Get`, nameObj).then((data) => data.json())

export const createPatreon = (patreonObj) =>
  api.post(`${patreonResource}/Post`, patreonObj).then((data) => data.json())

export const updatePatreon = (patreonObj) =>
  api.put(patreonResource, patreonObj).then((data) => data.json())

export const deletePatreon = (patreonId) => api.delete(`${patreonResource}?id=${patreonId}`)
