const defaultModel = {
  IdModel: 0,
  ModelName: '',
  Path: '',
  Photo: '',
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
  image: [],
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

export { defaultModel, defaultDelete, months }
