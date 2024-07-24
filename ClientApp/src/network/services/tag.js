import { api } from '../adapters/api'

const tagResource = 'Tag'

export const getTags = (nameObj) => api.post(`${tagResource}/Get`, nameObj)

export const createTag = (tagObj) => api.post(`${tagResource}/Post`, tagObj)

export const updateTag = (tagObj) => api.put(tagResource, tagObj)

export const deleteTag = (tagId) => api.delete(`${tagResource}?id=${tagId}`)
