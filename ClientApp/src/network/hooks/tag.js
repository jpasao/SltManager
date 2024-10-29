import { useState, useEffect } from 'react'
import * as tagService from '../services/tag'
import { returnResponse } from '../../defaults/global'

export const useGetTags = (tagObject) => {
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await tagService.getTags(tagObject).then((response) => {
        setTags(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshTags = () => {
    setRefresh(!refresh)
  }

  return { tags, refreshTags, isLoading }
}

export const useCreateTag = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createTag = async (tagObject) => {
    setIsLoading(true)
    return await tagService.createTag(tagObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { createTag, isLoading }
}

export const useUpdateTag = () => {
  const [isLoading, setIsLoading] = useState(false)

  const updateTag = async (tagObject) => {
    setIsLoading(true)
    return await tagService.updateTag(tagObject).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }
  return { updateTag, isLoading }
}

export const useDeleteTag = () => {
  const [isLoading, setIsLoading] = useState(false)

  const deleteTag = async (tagId) => {
    setIsLoading(true)
    return await tagService.deleteTag(tagId).then((response) => {
      setIsLoading(false)
      return returnResponse(response)
    })
  }

  return { deleteTag, isLoading }
}
