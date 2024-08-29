import { useState, useEffect } from 'react'
import * as tagService from '../services/tag'

export const useGetTags = (tagObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    tagService.getTags(tagObject).then((tags) => {
      setTags(tags)
      setIsLoading(false)
    })
  }, [refresh])

  const refreshTags = () => {
    setRefresh(!refresh)
  }

  return { tags, refreshTags, isLoading }
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
  const deleteTag = (tagId) => tagService.deleteTag(tagId)

  return { deleteTag }
}
