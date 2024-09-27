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
  postImage: (endpoint, body) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'POST',
      body: body,
    }),
  put: (endpoint, body) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'PUT',
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      Accept: 'application/json',
    }),
  delete: (endpoint) =>
    fetch(`${basePath}/${endpoint}`, {
      method: 'DELETE',
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    }),
}

export { api }
