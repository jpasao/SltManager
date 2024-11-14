import { useState, useEffect } from 'react'
import * as dashboardService from '../services/dashboard'
import { returnResponse } from '../../defaults/global'

export const useGetOverview = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [overviewData, setOverviewData] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await dashboardService.getOverview().then((response) => {
        setOverviewData(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshOverview = () => {
    setRefresh(!refresh)
  }

  return { overviewData, refreshOverview, isLoading }
}

export const useGetModel = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modelData, setModelData] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await dashboardService.getModels().then((response) => {
        setModelData(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshModel = () => {
    setRefresh(!refresh)
  }

  return { modelData, refreshModel, isLoading }
}

export const useGetPatreon = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [patreonData, setPatreonData] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await dashboardService.getPatreons().then((response) => {
        setPatreonData(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshPatreon = () => {
    setRefresh(!refresh)
  }

  return { patreonData, refreshPatreon, isLoading }
}

export const useGetTag = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tagData, setTagData] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      await dashboardService.getTags().then((response) => {
        setTagData(returnResponse(response))
        setIsLoading(false)
      })
    }
    getData()
  }, [refresh])

  const refreshTag = () => {
    setRefresh(!refresh)
  }

  return { tagData, refreshTag, isLoading }
}
