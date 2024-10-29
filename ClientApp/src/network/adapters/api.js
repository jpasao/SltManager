import { serverUrl } from '../../defaults/global'
const basePath = serverUrl

export const get = async (endpoint) => {
  const fetchResponse = await fetch(`${basePath}/${endpoint}`)
  return buildResponse(fetchResponse)
}
export const post = async (endpoint, body) => {
  const fetchResponse = await fetch(`${basePath}/${endpoint}`, {
    method: 'POST',
    body: body && JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    Accept: 'application/json',
  })
  return await buildResponse(fetchResponse)
}
export const postImage = async (endpoint, body) => {
  const fetchResponse = await fetch(`${basePath}/${endpoint}`, {
    method: 'POST',
    body: body,
  })
  return await buildResponse(fetchResponse)
}
export const put = async (endpoint, body) => {
  const fetchResponse = await fetch(`${basePath}/${endpoint}`, {
    method: 'PUT',
    body: body && JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    Accept: 'application/json',
  })
  return await buildResponse(fetchResponse)
}
export const deleteItem = async (endpoint) => {
  const fetchResponse = await fetch(`${basePath}/${endpoint}`, {
    method: 'DELETE',
    Accept: 'application/json, text/plain',
    'Content-Type': 'application/json',
  })
  return await buildResponse(fetchResponse)
}

const buildResponse = async (fetchResponse) => {
  const code = fetchResponse.status
  if (code === undefined) return
  if (code === 200) {
    return await fetchResponse?.json()
  }
  let response
  const errorObj = {
    type: 'Error',
    message: '',
    data: '',
    code: code,
  }
  if (code === 500) {
    errorObj.message = 'An internal server error occurred'
  }
  if (code >= 400) {
    let message = ''
    if (response === undefined) response = await fetchResponse?.json()
    Object.keys(response.errors).forEach((m) => (message += `${response.errors[m]} `))
    errorObj.message = response.title || 'An error occurred'
    errorObj.data = message || ''
  }
  const error = new Error()
  error.info = errorObj
  return error
}
