import { api } from '../adapters/api'

const tagResource = 'Tag'

export const getTags = (nameObj) =>
  api.post(`${tagResource}/Get`, nameObj).then((data) => data.json())

export const createTag = (tagObj) =>
  api.post(`${tagResource}/Post`, tagObj).then((data) => data.json())

export const updateTag = (tagObj) => api.put(tagResource, tagObj).then((data) => data.json())

export const deleteTag = (tagId) => api.delete(`${tagResource}?id=${tagId}`)
