import { useState } from 'react'
import * as tagService from '../services/tag'

export const useGetTags = () => {
  const [tags, setTags] = useState([])

  const getTags = (tagObject) => {
    return tagService.getTags(tagObject).then(({ tags }) => {
      setTags(tags)
    })
  }
  return { getTags }
}

export const useCreateTag = () => {
  const createTag = (tagObject) => {
    return tagService.createTag(tagObject)
  }
  return { createTag }
}

export const useUpdateTag = () => {
  const updateTag = (tagObject) => {
    return tagService.updateTag(tagObject)
  }
  return { updateTag }
}

export const useDeleteTag = () => {
  const deleteTag = (tagObject) => {
    return tagService.deleteTag(tagObject)
  }
  return { deleteTag }
}
