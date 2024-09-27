import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  useCreateModel,
  useGetPhotos,
  useUpdateModel,
  useDeletePhoto,
  useCreatePhoto,
} from '../../network/hooks/model'
import { useGetPatreons } from '../../network/hooks/patreon'
import { useGetTags } from '../../network/hooks/tag'
import { defaultModel, months } from '../../defaults/model'
import { defaultPatreon } from '../../defaults/patreon'
import { defaultTag } from '../../defaults/tag'
import {
  CBadge,
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CImage,
  CRow,
  CToaster,
} from '@coreui/react'
import NoImage from '/no-image.png'
import Toast from '../../components/ToastComponent'

const ModelSave = () => {
  const location = useLocation()
  const { updateModel } = useUpdateModel()
  const { createModel } = useCreateModel()
  const { getPhotos } = useGetPhotos()
  const { deletePhoto } = useDeletePhoto()
  const { createPhoto } = useCreatePhoto()
  const { patreons } = useGetPatreons(defaultPatreon)
  const { tags } = useGetTags(defaultTag)
  const [validated, setValidated] = useState(false)
  const [years, setYears] = useState([])
  const [model, setModel] = useState(defaultModel)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  let modelToSave = defaultModel
  let editingModel = location.state !== null
  let method = editingModel ? 'put' : 'post'

  useEffect(() => {
    if (editingModel) {
      modelToSave = structuredClone(location.state)
      modelToSave = Object.assign(
        {},
        {
          IdModel: modelToSave.IdModel,
          ModelName: modelToSave.ModelName,
          Path: modelToSave.Path,
          Year: modelToSave.Year,
          Month: modelToSave.Month,
          Tag: modelToSave.Tag,
          Patreon: modelToSave.Patreon,
          TagIdList: [],
        },
      )
      getPhotos(modelToSave.IdModel).then((photos) => {
        modelToSave.Image = photos
        setModel(modelToSave)
      })
    } else {
      setModel(defaultModel)
    }
  }, [defaultModel])

  if (!editingModel && model.IdModel !== 0) {
    setModel(defaultModel)
  }
  if (years.length === 0) {
    let yearArray = Array.from({ length: 21 }, (e, i) => i + 2010)
    setYears(yearArray)
  }

  const handleName = (event) => {
    const { ModelName, ...rest } = model
    const modifiedModel = { ModelName: event.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handleYear = (event) => {
    const { Year, ...rest } = model
    const modifiedModel = { Year: event.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handleMonth = (event) => {
    const { Month, ...rest } = model
    const modifiedModel = { Month: event.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handlePatreon = (event) => {
    const { Patreon, ...rest } = model
    const modifiedModel = { Patreon: { IdPatreon: event.target.value }, ...rest }
    setModel(modifiedModel)
  }
  const handleTag = (event) => {
    const { Tag, ...rest } = model
    let selectedTags = []
    for (let tag of event.target.options) {
      if (tag.selected) selectedTags.push({ IdTag: tag.value, TagName: tag.text })
    }
    const modifiedModel = {
      Tag: selectedTags,
      ...rest,
    }
    setModel(modifiedModel)
  }
  const handlePath = (event) => {
    const { Path, ...rest } = model
    const modifiedModel = { Path: event.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handleImage = (event) => {
    if (event.target.files) {
      let selectedImages = model.Image
      for (let photo of event.target.files) {
        convertToBase64(photo).then((base64) => {
          selectedImages.push({ IdPhoto: 0, IdImage: 0, Image: base64 })
          const { Image, ...rest } = model
          const modifiedModel = { Image: selectedImages, ...rest }
          setModel(modifiedModel)
        })

        const formData = new FormData()
        formData.append('photo', photo, photo.name)
        createPhoto(formData, model.IdModel).then(
          (newIdPhoto) => {
            const { Image, ...rest } = model
            for (const element of Image) {
              if (element.IdPhoto === 0) {
                element.IdPhoto = newIdPhoto
                break
              }
            }
            const modifiedModel = { Image: Image, ...rest }
            setModel(modifiedModel)
            resultToast('La imagen se ha guardado correctamente', 'primary')
          },
          () => resultToast('Hubo un problema al guardar la imagen', 'danger'),
        )
      }
    }
  }
  const setImage = (element) => {
    if (element === null) return NoImage

    const image = element.Image
    const header = image.includes('data:image/') ? '' : 'data:image/jpeg;base64,'
    return `${header}${image}`
  }
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(new Error(error))
      }
    })
  }
  const handleSave = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    setValidated(true)
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }
    if (editingModel) {
      updateModel(model).then(
        () => resultToast('El modelo se ha guardado correctamente', 'primary'),
        () => resultToast('Hubo un problema al guardar el modelo', 'danger'),
      )
    } else {
      createModel(model).then(
        () => {
          setEditingModel(true)
          setMethod('put')
          setValidated(false)
          resultToast('El modelo se ha creado correctamente', 'primary')
        },
        () => resultToast('Hubo un problema al crear el modelo', 'danger'),
      )
    }
  }
  const handleDeletePhoto = (photoId) => {
    deletePhoto(photoId).then(
      () => {
        const { Image, ...rest } = model
        const filteredImages = Image.filter((image) => image.IdPhoto !== photoId)
        const modifiedModel = { Image: filteredImages, ...rest }
        setModel(modifiedModel)
        resultToast('La imagen se ha borrado correctamente', 'primary')
      },
      () => resultToast('Hubo un problema al borrar la imagen', 'danger'),
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingModel ? 'Editar' : 'Crear'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="g-3 needs-validation"
              noValidate
              validated={validated}
              method={method}
              onSubmit={handleSave}
            >
              <CRow xs={{ gutter: 2 }}>
                <CCol md>
                  <CFormInput
                    type="text"
                    id="modelName"
                    value={model.ModelName}
                    onChange={handleName}
                    feedbackInvalid="¿Qué es un modelo sin un nombre?"
                    floatingClassName="mb-3"
                    floatingLabel="Nombre"
                    placeholder="Nombre del Modelo"
                    required
                  />
                </CCol>
                <CCol>
                  <CFormSelect
                    id="year"
                    value={model.Year}
                    onChange={handleYear}
                    feedbackInvalid="¿De qué año era modelo?"
                    floatingLabel="Año"
                    placeholder="Año del Modelo"
                    required
                  >
                    <option value="">Selecciona un año...</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol>
                  <CFormSelect
                    id="month"
                    value={model.Month}
                    onChange={handleMonth}
                    feedbackInvalid="¿De qué mes era modelo?"
                    floatingLabel="Mes"
                    placeholder="Mes del Modelo"
                    required
                  >
                    <option value="">Selecciona un mes...</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow xs={{ gutter: 2 }}>
                <CCol>
                  <CFormInput
                    type="text"
                    id="path"
                    value={model.Path}
                    onChange={handlePath}
                    feedbackInvalid="¿Dónde está el modelo?"
                    floatingClassName="mb-3"
                    floatingLabel="Ruta"
                    placeholder="Ruta del Modelo"
                    required
                  />
                </CCol>
                <CCol>
                  <CFormSelect
                    id="patreon"
                    value={model.Patreon.IdPatreon}
                    onChange={handlePatreon}
                    feedbackInvalid="¿Qué es un modelo sin un Patreon?"
                    floatingLabel="Patreon"
                    placeholder="Patreon del Modelo"
                    required
                  >
                    <option value="">Selecciona un patreon...</option>
                    {patreons.map((patreon) => (
                      <option key={patreon.IdPatreon} value={patreon.IdPatreon}>
                        {patreon.PatreonName}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol>
                  <CFormSelect
                    id="tag"
                    value={model.Tag.map((tag) => tag.IdTag)}
                    onChange={handleTag}
                    feedbackInvalid="Vamos a ponerle al menos una etiqueta..."
                    floatingLabel="Etiqueta"
                    placeholder="Etiquetas del modelo"
                    multiple
                    required
                  >
                    <option value="">Selecciona etiquetas...</option>
                    {tags.map((tag) => (
                      <option key={tag.IdTag} value={tag.IdTag}>
                        {tag.TagName}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow xs={{ gutter: 2 }}>
                <CCol>
                  <CFormInput
                    type="file"
                    id="Image"
                    label={
                      editingModel
                        ? 'Fotos del modelo'
                        : 'Guarda primero el modelo para añadir fotos'
                    }
                    disabled={!editingModel}
                    onChange={handleImage}
                  />
                </CCol>
                <CCol>
                  <CButton color="primary" className="alignRight" type="submit">
                    Guardar
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            <div className="clearfix imageThumbnails">
              {model?.Image?.length ? (
                model.Image.map((element) => (
                  <span key={element.IdPhoto}>
                    <CImage src={setImage(element)} height={250} />
                    <CBadge
                      color="danger"
                      className="deleteImg"
                      onClick={() => handleDeletePhoto(element.IdPhoto)}
                    >
                      &times;
                    </CBadge>
                  </span>
                ))
              ) : (
                <CCallout color="light">Modelo sin imágenes</CCallout>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CToaster className="p-3" placement="bottom-end" push={toast} ref={toaster} />
    </CRow>
  )
}

export default ModelSave
