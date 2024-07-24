import { api } from '../adapters/api'

const patreonResource = 'Patreon'

export const getPatreons = (nameObj) =>
  api.post(`${patreonResource}/Get`, nameObj).then((data) => data.json())

export const createPatreon = (patreonObj) => api.post(`${patreonResource}/Post`, patreonObj)

export const updatePatreon = (patreonObj) => api.put(patreonResource, patreonObj)

export const deletePatreon = (patreonId) => api.delete(`${patreonResource}?id=${patreonId}`)
