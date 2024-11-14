import { get } from '../adapters/api'

const dashboardResource = 'Dashboard'

export const getOverview = async () => await get(`${dashboardResource}/Overview`)

export const getModels = async () => await get(`${dashboardResource}/Model`)

export const getPatreons = async () => await get(`${dashboardResource}/Patreon`)

export const getTags = async () => await get(`${dashboardResource}/Tag`)
