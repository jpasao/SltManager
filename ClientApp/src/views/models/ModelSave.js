import React, { useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import CreatableSelect from 'react-select/creatable'
import { useLocation } from 'react-router-dom'
import {
  useCreateModel,
  useGetPhotos,
  useUpdateModel,
  useDeletePhoto,
  useCreatePhoto,
} from '../../network/hooks/model'
import { useGetPatreons, useCreatePatreon } from '../../network/hooks/patreon'
import { useGetTags, useCreateTag } from '../../network/hooks/tag'
import { defaultModel, invalidSelectMessage, months } from '../../defaults/model'
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
  CImage,
  CRow,
  CToaster,
} from '@coreui/react'
import NoImage from '/no-image.png'
import Toast from '../../components/ToastComponent'

const ModelSave = () => {
  const location = useLocation()
  const animatedComponents = makeAnimated()
  const { updateModel } = useUpdateModel()
  const { createModel } = useCreateModel()
  const { getPhotos } = useGetPhotos()
  const { deletePhoto } = useDeletePhoto()
  const { createPhoto } = useCreatePhoto()
  const { patreons, refreshPatreons } = useGetPatreons(defaultPatreon)
  const { createPatreon } = useCreatePatreon()
  const { tags, refreshTags } = useGetTags(defaultTag)
  const { createTag } = useCreateTag()
  const [validated, setValidated] = useState(false)
  const [years, setYears] = useState([])
  const selectClass = useRef({})
  const selectErrorMessage = useRef({})
  const [model, setModel] = useState(defaultModel)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  let modelToSave = defaultModel
  let editingModel = location.state !== null
  let method = editingModel ? 'put' : 'post'
  const selectFormFields = ['Year', 'Month', 'Patreon', 'Tag']

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
      setModel(modelToSave)
      getPhotos(modelToSave.IdModel).then((photos) => {
        const { Image, ...rest } = modelToSave
        const modelWithImages = { Image: photos, ...rest }

        setModel(modelWithImages)
      })
    } else {
      setModel(defaultModel)
    }
  }, [defaultModel])

  if (!editingModel && model.IdModel !== 0) {
    setModel(defaultModel)
  }
  if (years.length === 0) {
    let yearArray = Array.from({ length: 21 }, (e, i) => i + 2020).map((option) => {
      return { value: option, label: option }
    })
    setYears(yearArray)
  }

  const handleName = (event) => {
    const { ModelName, ...rest } = model
    const modifiedModel = { ModelName: event?.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handleYear = (event) => {
    const { Year, ...rest } = model
    const sentData = event?.value || event?.target.innerText || 0
    const modifiedModel = { Year: sentData, ...rest }
    setModel(modifiedModel)
    validateSelects(sentData, validated, 'year')
  }
  const handleMonth = (event) => {
    const { Month, ...rest } = model
    const sentData = event?.value || event?.target.innerText || 0
    const modifiedModel = { Month: sentData, ...rest }
    setModel(modifiedModel)
    validateSelects(sentData, validated, 'month')
  }
  const handlePatreon = (event) => {
    const { Patreon, ...rest } = model
    const sentData = event?.value || event?.target.innerText || 0
    const modifiedModel = { Patreon: { IdPatreon: sentData }, ...rest }
    validateSelects(sentData, validated, 'patreon')
    setModel(modifiedModel)
  }
  const handleTag = (event) => {
    const { Tag, ...rest } = model
    let selectedTags = []
    for (let tag of event) {
      selectedTags.push({ IdTag: tag.value, TagName: '' })
    }
    const modifiedModel = {
      Tag: selectedTags,
      ...rest,
    }
    const firstValue = selectedTags.length == 0 ? 0 : selectedTags[0].IdTag
    validateSelects(firstValue, validated, 'tag')
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
  const checkSelectsAreValid = () => {
    let allFieldsFilled = true
    for (let selectField of selectFormFields) {
      let modelValue
      switch (selectField) {
        case 'Patreon':
          modelValue = model[selectField].IdPatreon
          break
        case 'Tag':
          modelValue = model[selectField][0].IdTag
          break
        default:
          modelValue = model[selectField]
          break
      }
      allFieldsFilled = allFieldsFilled && modelValue
      validateSelects(modelValue, true, selectField.toLowerCase())
    }
    return allFieldsFilled
  }
  const validateSelects = (value, isFormValidated, field) => {
    if (!isFormValidated) return
    const displayValue = value ? 'none' : 'block'
    const classValue = value ? 'valid' : 'error'

    selectErrorMessage.current[field] = {}
    selectErrorMessage.current[field].display = displayValue
    selectClass.current[field] = classValue
  }
  const handleSave = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    let selectsAreValid = checkSelectsAreValid()
    setValidated(true)
    if (form.checkValidity() === false || selectsAreValid === false) {
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
          editingModel = true
          method = 'put'
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
  const handleCreatePatreon = (patreonName) => {
    const newPatreon = { IdPatreon: 0, PatreonName: patreonName }
    createPatreon(newPatreon).then(
      () => {
        refreshPatreons()
        resultToast(`El Patreon '${patreonName}' se ha guardado correctamente`, 'primary')
      },
      () => resultToast(`Hubo un problema al guardar el Patreon '${patreonName}'`, 'danger'),
    )
  }
  const handleCreateTag = (tagName) => {
    const newTag = { IdTag: 0, TagName: tagName }
    createTag(newTag).then(
      () => {
        refreshTags()
        resultToast(`La etiqueta '${tagName}' se ha guardado correctamente`, 'primary')
      },
      () => resultToast(`Hubo un problema al guardar la etiqueta '${tagName}'`, 'danger'),
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
                  <Select
                    id="year"
                    classNamePrefix="filter"
                    className={selectClass.current.year}
                    options={years}
                    value={model.Year === 0 ? null : { value: model.Year, label: model.Year }}
                    isLoading={years.length == 0}
                    onChange={handleYear}
                    placeholder="Selecciona un año..."
                    isClearable={true}
                    hideSelectedOptions={true}
                  />
                  <label className="form-select-label" htmlFor="year">
                    Año
                  </label>
                  <div style={selectErrorMessage.current.year} className={invalidSelectMessage}>
                    ¿De qué año era el modelo?
                  </div>
                </CCol>
                <CCol>
                  <Select
                    id="month"
                    classNamePrefix="filter"
                    className={selectClass.current.month}
                    options={months}
                    value={
                      model.Month === 0
                        ? null
                        : {
                            value: model.Month,
                            label: months.find((month) => month.value === model.Month)?.label,
                          }
                    }
                    isLoading={months.length == 0}
                    onChange={handleMonth}
                    placeholder="Selecciona un mes..."
                    isClearable={true}
                    hideSelectedOptions={true}
                  />
                  <label className="form-select-label" htmlFor="month">
                    Mes
                  </label>
                  <div style={selectErrorMessage.current.month} className={invalidSelectMessage}>
                    ¿De qué mes era el modelo?
                  </div>
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
                  <CreatableSelect
                    id="patreon"
                    classNamePrefix="filter"
                    className={selectClass.current.patreon}
                    options={patreons.map((patreon) => {
                      return { value: patreon.IdPatreon, label: patreon.PatreonName }
                    })}
                    value={
                      model.Patreon.IdPatreon === 0
                        ? null
                        : { value: model.Patreon.IdPatreon, label: model.Patreon.PatreonName }
                    }
                    isLoading={patreons.length == 0}
                    formatCreateLabel={(term) => `Crear nuevo Patreon '${term}'`}
                    onCreateOption={handleCreatePatreon}
                    onChange={handlePatreon}
                    placeholder="Selecciona un patreon..."
                    isClearable={true}
                    hideSelectedOptions={true}
                  />
                  <label className="form-select-label" htmlFor="patreon">
                    Patreon
                  </label>
                  <div style={selectErrorMessage.current.patreon} className={invalidSelectMessage}>
                    Este modelo pertenecerá a algún Patreon...
                  </div>
                </CCol>
                <CCol>
                  <CreatableSelect
                    id="tag"
                    classNamePrefix="filter"
                    className={selectClass.current.tag}
                    components={animatedComponents}
                    options={tags.map((tag) => {
                      return { value: tag.IdTag, label: tag.TagName }
                    })}
                    value={
                      model.Tag[0].IdTag === 0
                        ? null
                        : model.Tag.map((tag) => {
                            return { value: tag.IdTag, label: tag.TagName }
                          })
                    }
                    isLoading={tags.length == 0}
                    formatCreateLabel={(term) => `Crear nueva etiqueta '${term}'`}
                    onCreateOption={handleCreateTag}
                    noOptionsMessage={() => 'Ya no hay más etiquetas'}
                    onChange={handleTag}
                    isMulti
                    placeholder="Selecciona una etiqueta..."
                    isClearable={true}
                  />
                  <label className="form-select-label" htmlFor="tag">
                    Etiquetas
                  </label>
                  <div style={selectErrorMessage.current.tag} className={invalidSelectMessage}>
                    Vamos a asignarle al menos una etiqueta...
                  </div>
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
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </CRow>
  )
}

export default ModelSave
