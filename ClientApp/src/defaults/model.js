import { useState, useEffect, useRef, useCallback } from 'react'
const defaultModel = {
  IdModel: 0,
  ModelName: '',
  Path: '',
  Year: 0,
  Month: 0,
  Patreon: {
    IdPatreon: 0,
  },
  Tag: [
    {
      IdTag: 0,
      TagName: '',
    },
  ],
  TagIdList: [0],
  Image: [],
}

const defaultDelete = { id: 0, name: '', page: 'Modelos' }

const months = [
  { value: 1, name: 'Enero' },
  { value: 2, name: 'Febrero' },
  { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' },
  { value: 5, name: 'Mayo' },
  { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' },
  { value: 8, name: 'Agosto' },
  { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' },
  { value: 11, name: 'Noviembre' },
  { value: 12, name: 'Diciembre' },
]

const useStateCallback = (initialState) => {
  const [state, setState] = useState(initialState)
  const cbRef = useRef(null)

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb
    setState(state)
  }, [])

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state)
      cbRef.current = null
    }
  }, [state])

  return [state, setStateCallback]
}

export { defaultModel, defaultDelete, months, useStateCallback }
