import { useState, useEffect, useRef, useCallback } from 'react'
import { serverUrl } from './global'
const defaultModel = {
  IdModel: 0,
  ModelName: '',
  Path: '',
  Year: 0,
  Month: 0,
  Patreon: {
    IdPatreon: 0,
  },
  IdCollection: 0,
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
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
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

const hubUrl = `${serverUrl}/hub`

export { defaultModel, defaultDelete, months, useStateCallback, hubUrl }
