const basePath = 'http://localhost:5003'

const api = {
  get: (endpoint) => fetch(`${basePath}/${endpoint}`),
  post: (endpoint, body) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'POST',
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      Accept: 'application/json',
    }),
  put: (endpoint, body) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'PUT',
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
      body: body && JSON.stringify(body),
    }),
  delete: (endpoint) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'DELETE',
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    }),
}

export { api }
