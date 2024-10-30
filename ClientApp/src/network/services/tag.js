import { get, post, put, deleteItem } from '../adapters/api'

const tagResource = 'Tag'

export const getTags = async (nameObj) => await post(`${tagResource}/Get`, nameObj)

export const createTag = async (tagObj) => await post(`${tagResource}/Post`, tagObj)

export const updateTag = async (tagObj) => await put(tagResource, tagObj)

export const deleteTag = async (tagId) => await deleteItem(`${tagResource}?id=${tagId}`)

export const getDependencies = async (tagId) => await get(`${tagResource}/Dependency?id=${tagId}`)
