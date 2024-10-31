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
  useGetDependencies,
} from '../../network/hooks/model'
import { useGetPatreons, useCreatePatreon } from '../../network/hooks/patreon'
import { useGetCollections, useCreateCollection } from '../../network/hooks/collection'
import { useGetTags, useCreateTag } from '../../network/hooks/tag'
import { defaultModel, months, stlRootPath } from '../../defaults/model'
import { defaultPatreon } from '../../defaults/patreon'
import { defaultCollection } from '../../defaults/collection'
import { defaultTag } from '../../defaults/tag'
import { invalidSelectMessage } from '../../defaults/global'
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
  CInputGroup,
  CRow,
  CToaster,
} from '@coreui/react'
import NoImage from '/no-image.png'
import Toast from '../../components/ToastComponent'
import DependencyComponent from '../../components/DependencyComponent'
import SignalRConnector from '../../network/adapters/signalr'

const ModelSave = () => {
  const location = useLocation()
  const animatedComponents = makeAnimated()
  const { updateModel, isLoading: isUpdatingItem } = useUpdateModel()
  const { createModel, isLoading: isCreatingItem } = useCreateModel()
  const { getPhotos, isLoading: isFetchingPhotos } = useGetPhotos()
  const { deletePhoto, isLoading: isDeletingPhoto } = useDeletePhoto()
  const { createPhoto, isLoading: isCreatingPhoto } = useCreatePhoto()
  const { getDependencies, isLoading: isGettingDependencies } = useGetDependencies()
  const { patreons, refreshPatreons } = useGetPatreons(defaultPatreon)
  const { createPatreon } = useCreatePatreon()
  const [searchCollection, setSearchCollection] = useState(defaultCollection)
  const { collections, refreshCollections } = useGetCollections(searchCollection)
  const { createCollection } = useCreateCollection()
  const { tags, refreshTags } = useGetTags(defaultTag)
  const { createTag } = useCreateTag()
  const [dependencies, setDependencies] = useState([])
  const [validated, setValidated] = useState(false)
  const [years, setYears] = useState([])
  const selectClass = useRef({})
  const selectErrorMessage = useRef({})
  const [model, setModel] = useState(defaultModel)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  let editingModel = useRef()
  let method = useRef()
  const { connection } = SignalRConnector()

  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const isLoading =
    isCreatingItem ||
    isUpdatingItem ||
    isFetchingPhotos ||
    isDeletingPhoto ||
    isCreatingPhoto ||
    isGettingDependencies

  let modelToSave = defaultModel
  const requiredSelectFields = ['Patreon', 'Tag']
  method.current = 'put'
  useEffect(() => {
    editingModel.current = location.state !== null
    method.current = editingModel.current ? 'put' : 'post'
    if (editingModel.current) {
      modelToSave = structuredClone(location.state)
      const selectedTags =
        modelToSave.Tag.length === 0 || modelToSave.Tag[0].IdTag === 0
          ? null
          : modelToSave.Tag.map((tag) => tag.IdTag)
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
          IdCollection: modelToSave.IdCollection,
          TagIdList: selectedTags,
        },
      )
      async function getDependencies() {
        await checkDependencies(modelToSave)
      }
      getDependencies()
      setModel(modelToSave)

      getPhotos(modelToSave.IdModel).then((photos) => {
        const { Image, ...rest } = modelToSave
        const photoArray = Array.isArray(photos) ? photos : []
        const modelWithImages = { Image: photoArray, ...rest }

        setModel(modelWithImages)
      })
    } else {
      setModel(defaultModel)
    }
  }, [defaultModel])

  if (!editingModel.current && model.IdModel !== 0) {
    setModel(defaultModel)
  }
  if (years.length === 0) {
    let yearArray = Array.from({ length: 21 }, (e, i) => i + 2019).map((option) => {
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
    const selectedPatreon = event?.value || event?.target.innerText || 0
    const modifiedModel = { Patreon: { IdPatreon: selectedPatreon }, ...rest }
    validateSelects(selectedPatreon, validated, 'patreon')
    setModel(modifiedModel)
    const defaultCollectionClone = JSON.parse(JSON.stringify(defaultCollection))
    const newCollectionSearch = {
      ...defaultCollectionClone,
      Patreon: { IdPatreon: selectedPatreon },
    }
    setSearchCollection(newCollectionSearch, refreshCollections())
  }
  const patreonOptions = patreons.map((patreon) => {
    return { value: patreon.IdPatreon, label: patreon.PatreonName }
  })
  const patreonValue =
    model.Patreon.IdPatreon === 0
      ? null
      : {
          value: model.Patreon.IdPatreon,
          label: patreons.find((pat) => pat.IdPatreon === model.Patreon.IdPatreon)?.PatreonName,
        }
  const handleCollection = (event) => {
    const { IdCollection, ...rest } = model
    const sentData = event?.value || event?.target.innerText || 0
    const modifiedModel = { IdCollection: sentData, ...rest }
    validateSelects(sentData, validated, 'collection')
    setModel(modifiedModel)
  }
  const collectionOptions = collections.map((collection) => {
    return { value: collection.IdCollection, label: collection.CollectionName }
  })
  const collectionValue =
    model.IdCollection === 0
      ? null
      : {
          value: model.IdCollection,
          label:
            collections.length === 0
              ? ''
              : collections.find((col) => col.IdCollection === model.IdCollection).CollectionName,
        }
  const handleTag = (event) => {
    const { Tag, ...rest } = model
    let selectedTags = []
    for (let option of event) {
      selectedTags.push({ IdTag: option.value, TagName: option.label })
    }
    if (selectedTags.length === 0) {
      selectedTags.push({ IdTag: 0 })
    }
    const modifiedModel = {
      Tag: selectedTags,
      ...rest,
    }
    const firstValue = selectedTags.length == 0 ? 0 : selectedTags[0].IdTag
    validateSelects(firstValue, validated, 'tag')
    setModel(modifiedModel)
  }
  const tagOptions = tags.map((tag) => {
    return { value: tag.IdTag, label: tag.TagName }
  })
  const tagValues =
    model.Tag[0].IdTag === 0
      ? null
      : model.Tag.map((tag) => {
          return { value: tag.IdTag, label: tag.TagName }
        })
  const handlePath = (event) => {
    const { Path, ...rest } = model
    const modifiedModel = { Path: event.target.value, ...rest }
    setModel(modifiedModel)
  }
  const handleDefaultFolder = () => {
    connection.invoke('SendPath', stlRootPath)
  }
  const handleImage = async (event) => {
    if (event.target.files) {
      let selectedImages = model.Image || []
      for (let photo of event.target.files) {
        convertToBase64(photo).then((base64) => {
          selectedImages.push({ IdPhoto: 0, IdImage: 0, Image: base64 })
          const { Image, ...rest } = model
          const modifiedModel = { Image: selectedImages, ...rest }
          setModel(modifiedModel)
        })

        const formData = new FormData()
        formData.append('photo', photo, photo.name)
        await createPhoto(formData, model.IdModel).then(
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
          (error) => resultToast(`Hubo un problema al guardar la imagen: ${error}`, 'danger'),
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
    for (let selectField of requiredSelectFields) {
      let modelValue
      switch (selectField) {
        case 'Patreon':
          modelValue = model[selectField].IdPatreon
          break
        case 'Collection':
          modelValue = model.IdCollection
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
    return !!allFieldsFilled
  }
  const validateSelects = (value, isFormValidated, field) => {
    if (!isFormValidated) return
    const displayValue = value ? 'none' : 'block'
    const classValue = value ? 'valid' : 'error'

    selectErrorMessage.current[field] = {}
    selectErrorMessage.current[field].display = displayValue
    selectClass.current[field] = classValue
  }
  const handleSave = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    let selectsAreValid = checkSelectsAreValid()
    setValidated(true)
    if (form.checkValidity() === false || selectsAreValid === false) {
      event.stopPropagation()
      return
    }
    if (editingModel.current) {
      await updateModel(model).then(
        () => resultToast('El modelo se ha guardado correctamente', 'primary'),
        (error) =>
          resultToast(
            `Hubo un problema al guardar el modelo '${model.ModelName}': ${error}`,
            'danger',
          ),
      )
    } else {
      await createModel(model).then(
        () => {
          editingModel.current = true
          method.current = 'put'
          setValidated(false)
          resultToast('El modelo se ha creado correctamente', 'primary')
        },
        (error) =>
          resultToast(
            `Hubo un problema al crear el modelo '${model.ModelName}': ${error}`,
            'danger',
          ),
      )
    }
  }
  const handleDeletePhoto = async (photoId) => {
    await deletePhoto(photoId).then(
      () => {
        const { Image, ...rest } = model
        const filteredImages = Image.filter((image) => image.IdPhoto !== photoId)
        const modifiedModel = { Image: filteredImages, ...rest }
        setModel(modifiedModel)
        resultToast('La imagen se ha borrado correctamente', 'primary')
      },
      (error) => resultToast(`Hubo un problema al borrar la imagen: ${error}`, 'danger'),
    )
  }
  const handleCreatePatreon = async (patreonName) => {
    const newPatreon = { IdPatreon: 0, PatreonName: patreonName }
    await createPatreon(newPatreon).then(
      () => {
        refreshPatreons()
        resultToast(`El Patreon '${patreonName}' se ha guardado correctamente`, 'primary')
      },
      (error) =>
        resultToast(`Hubo un problema al guardar el Patreon '${patreonName}': ${error}`, 'danger'),
    )
  }
  const handleCreateCollection = async (collectionName) => {
    if (patreon === 0) return
    const newCollection = {
      IdCollection: 0,
      Patreon: { IdPatreon: model.Patreon.IdPatreon },
      CollectionName: collectionName,
    }
    await createCollection(newCollection).then(
      () => {
        refreshCollections()
        resultToast(`La colección '${collectionName}' se ha guardado correctamente`, 'primary')
      },
      (error) =>
        resultToast(
          `Hubo un problema al guardar la colección '${collectionName}': ${error}`,
          'danger',
        ),
    )
  }
  const handleCreateTag = async (tagName) => {
    const newTag = { IdTag: 0, TagName: tagName }
    await createTag(newTag).then(
      () => {
        refreshTags()
        resultToast(`La etiqueta '${tagName}' se ha guardado correctamente`, 'primary')
      },
      (error) =>
        resultToast(`Hubo un problema al guardar la etiqueta '${tagName}': ${error}`, 'danger'),
    )
  }
  const checkDependencies = async (model) => {
    await getDependencies(model.IdModel).then(
      (dependencies) => {
        setDependencies(dependencies)
      },
      (error) =>
        resultToast(
          `Hubo un problema al comprobar las dependencias del modelo: ${error}`,
          'danger',
        ),
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingModel.current ? 'Editar' : 'Crear'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="g-3 needs-validation"
              noValidate
              validated={validated}
              method={method.current}
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
                  <CInputGroup>
                    <CButton
                      type="button"
                      color="secondary"
                      variant="outline"
                      id="button-addon1"
                      className="mb-3"
                      onClick={handleDefaultFolder}
                    >
                      Abrir carpeta de STL
                    </CButton>
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
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow xs={{ gutter: 2 }}>
                <CCol>
                  <CreatableSelect
                    id="patreon"
                    classNamePrefix="filter"
                    className={selectClass.current.patreon}
                    options={patreonOptions}
                    value={patreonValue}
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
                    id="collection"
                    classNamePrefix="filter"
                    className={selectClass.current.collection}
                    options={collectionOptions}
                    value={collectionValue}
                    isLoading={collections.length == 0}
                    formatCreateLabel={(term) => {
                      return model.Patreon.IdPatreon === 0
                        ? `Elije antes un Patreon para crear '${term}'`
                        : `Crear nueva colección '${term}' para '${patreon.textContent}'`
                    }}
                    onCreateOption={handleCreateCollection}
                    onChange={handleCollection}
                    placeholder="Selecciona una colección..."
                    isClearable={true}
                    hideSelectedOptions={true}
                  />
                  <label className="form-select-label" htmlFor="collection">
                    Colección
                  </label>
                  <div
                    style={selectErrorMessage.current.collection}
                    className={invalidSelectMessage}
                  >
                    Este modelo pertenecerá a alguna colección...
                  </div>
                </CCol>
              </CRow>
              <CRow xs={{ gutter: 2 }}>
                <CCol>
                  <CreatableSelect
                    id="tag"
                    classNamePrefix="filter"
                    className={selectClass.current.tag}
                    components={animatedComponents}
                    options={tagOptions}
                    value={tagValues}
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
                <CCol>
                  <CFormInput
                    type="file"
                    id="Image"
                    floatingClassName="mb-3"
                    floatingLabel={
                      editingModel.current
                        ? 'Fotos del modelo'
                        : 'Guarda primero el modelo para añadir fotos'
                    }
                    disabled={!editingModel.current}
                    onChange={handleImage}
                  />
                </CCol>
              </CRow>
              <CRow xs={{ gutter: 2 }}>
                <CCol>
                  <CButton
                    color="primary"
                    className="alignRight"
                    type="submit"
                    disabled={isLoading}
                  >
                    Guardar
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            <div className="clearfix imageThumbnails">
              <p>{model?.Image?.length ? `Fotos de '${model.ModelName}'` : ''}</p>
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
      <CCol xs={12}>
        <DependencyComponent
          name={model.ModelName}
          dependencies={dependencies}
          isEditing={location.state}
        />
      </CCol>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </CRow>
  )
}

export default ModelSave
