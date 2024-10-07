import React, { useState, useRef } from 'react'
import makeAnimated from 'react-select/animated'
import CreatableSelect from 'react-select/creatable'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CCollapse,
  CTable,
  CForm,
  CImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCarousel,
  CCarouselItem,
  CCardTitle,
  CCardText,
  CBadge,
  CCallout,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCaretTop,
  cilCaretBottom,
  cilPencil,
  cilTrash,
  cilFeaturedPlaylist,
} from '@coreui/icons'
import ModalWindow from '../../components/ModalComponent'
import {
  useGetModels,
  useDeleteModel,
  useOpenFolder,
  useGetPhotos,
} from '../../network/hooks/model'
import { useGetPatreons, useCreatePatreon } from '../../network/hooks/patreon'
import { useGetTags, useCreateTag } from '../../network/hooks/tag'
import { defaultModel, defaultDelete, months, useStateCallback } from '../../defaults/model'
import { defaultPatreon } from '../../defaults/patreon'
import { defaultTag } from '../../defaults/tag'
import { actionColumns, routeNames } from '../../defaults/global'
import NoImage from '/no-image.png'
import Toast from '../../components/ToastComponent'

const ModelSearch = () => {
  let deleteObj = structuredClone(defaultDelete)
  let selectInputRefPatreon = useRef()
  let selectInputRefTag = useRef()
  const animatedComponents = makeAnimated()

  const navigateTo = useNavigate()
  const [search, setSearch] = useState(defaultModel)
  const { models, refreshModels, isLoading: isFetchingItems } = useGetModels(search)
  const { deleteModel } = useDeleteModel()
  const { patreons, refreshPatreons } = useGetPatreons(defaultPatreon)
  const { createPatreon } = useCreatePatreon()
  const { getPhotos } = useGetPhotos(0)
  const { openFolder } = useOpenFolder()
  const { tags, refreshTags } = useGetTags(defaultTag)
  const { createTag } = useCreateTag()
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [visibleDetailModal, setVisibleDetailModal] = useState(false)
  const [name, setName] = useState('')
  const [patreon, setPatreon] = useState(0)
  const [model, setModel] = useState(defaultModel)
  const [images, setImages] = useState([])
  const [tag, setTag] = useStateCallback([])
  const [deleteData, setDeleteData] = useState(deleteObj)
  const [toast, setToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    setToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const handleName = (event) => {
    setName(event?.target.value)
  }
  const handlePatreon = (event) => setPatreon(event?.value || event?.target.innerText || 0)
  const handleTag = (event) => {
    let selectedTags = []
    for (let tag of event) {
      selectedTags.push(tag.value)
    }
    setTag(selectedTags)
  }

  const handleSearch = () => {
    refreshSearchParams()
    refreshModels()
  }
  const refreshSearchParams = () => {
    const defaultClone = JSON.parse(JSON.stringify(defaultModel))
    const newSearch = {
      ...defaultClone,
      ModelName: name,
      Year: 0,
      Month: 0,
      Patreon: { IdPatreon: patreon },
    }
    if (tag.length) {
      newSearch.Tag.length = 0
      tag.map((value) => newSearch.Tag.push({ IdTag: value, TagName: '' }))
    }
    setSearch(newSearch)
  }
  const cleanSearchParams = () => {
    const defaultClone = JSON.parse(JSON.stringify(defaultModel))
    setSearch(defaultClone)
  }

  const handleReset = () => {
    setName('')
    setPatreon(0)
    selectInputRefPatreon.current.clearValue()
    selectInputRefTag.current.clearValue()
    setTag([], cleanSearchParams())
  }
  const handleEdit = (model) => {
    navigateTo(routeNames.models.save, { state: model })
  }
  const handleDelete = (model) => {
    deleteObj.id = model.IdModel
    deleteObj.name = model.ModelName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = () => {
    deleteModel(deleteData.id).then(() => refreshModels())
    toggleDeleteModal(false)
  }
  const handleView = (model) => {
    setModel(model)
    getPhotos(model.IdModel).then((photos) => {
      setImages(photos)
      toggleDetailModal(true)
    })
  }
  const toggleDetailModal = (visible) => {
    setVisibleDetailModal(visible)
  }
  const setImage = (image) => {
    return image === null ? NoImage : `data:image/jpeg;base64,${image}`
  }
  const getMonthName = (monthNumber) => {
    return months.find((month) => month.value === monthNumber)?.label
  }
  const handleOpenFolder = (path) => {
    const pathObj = { path: path }
    openFolder(pathObj)
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

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      _props: { scope: 'col' },
    },
    {
      key: 'patreon',
      label: 'Patreon',
      _props: { scope: 'col' },
    },
    {
      key: 'year',
      label: 'Año',
      _props: { scope: 'col' },
    },
    {
      key: 'monthName',
      label: 'Mes',
      _props: { scope: 'col' },
    },
    ...actionColumns,
  ]

  const items = models.map((model) => {
    return {
      id: model.IdModel,
      name: model.ModelName,
      patreon: model.Patreon.PatreonName,
      year: model.Year,
      month: model.Month,
      monthName: getMonthName(model.Month),
      actions: (
        <>
          <CButton color="info" variant="ghost" size="sm" onClick={() => handleView(model)}>
            <CIcon icon={cilFeaturedPlaylist} />
          </CButton>
          <CButton color="warning" variant="ghost" size="sm" onClick={() => handleEdit(model)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDelete(model)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
    }
  })

  const detailColumns = [
    {
      key: 'name',
      label: '',
      _props: { scope: 'col' },
      _style: { width: '100px' },
    },
    {
      key: 'data',
      label: '',
      _props: { scope: 'col' },
    },
  ]
  const detailItems = [
    { name: 'Fecha:', data: `${getMonthName(model.Month)} de ${model.Year}` },
    {
      name: 'Ruta:',
      data: (
        <CButton
          color="link"
          onClick={() => handleOpenFolder(model.Path)}
          style={{ margin: '-8px 0 0 -12px' }}
        >
          {model.Path}
        </CButton>
      ),
    },
    {
      name: 'Patreon:',
      data: model.Patreon?.PatreonName,
    },
    {
      name: 'Etiquetas:',
      data: model.Tag?.map((tag) => (
        <CBadge key={tag.IdTag} color="secondary" style={{ marginRight: '5px' }}>
          {tag.TagName}
        </CBadge>
      )),
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Filtros</strong>
            <CButton
              color="primary"
              className="alignRight"
              variant="ghost"
              size="sm"
              onClick={() => setVisible(!visible)}
            >
              <CIcon icon={visible ? cilCaretTop : cilCaretBottom} />
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate onSubmit={handleSearch}>
              <CCollapse visible={visible}>
                <CRow xs={{ gutter: 2 }}>
                  <CCol md>
                    <CFormInput
                      type="text"
                      id="modelName"
                      value={name}
                      onChange={handleName}
                      floatingClassName="mb-3"
                      floatingLabel="Nombre"
                      placeholder="Filtra los Modelos por nombre..."
                    />
                  </CCol>
                  <CCol>
                    <CreatableSelect
                      id="patreon"
                      classNamePrefix="filter"
                      ref={selectInputRefPatreon}
                      options={patreons.map((patreon) => {
                        return { value: patreon.IdPatreon, label: patreon.PatreonName }
                      })}
                      isLoading={patreons.length == 0}
                      formatCreateLabel={(term) => `Crear nuevo Patreon '${term}'`}
                      onCreateOption={handleCreatePatreon}
                      onChange={handlePatreon}
                      placeholder="Selecciona un patreon..."
                      isClearable={true}
                    />
                    <label className="form-select-label" htmlFor="patreon">
                      Patreon
                    </label>
                  </CCol>
                  <CCol>
                    <CreatableSelect
                      id="tag"
                      classNamePrefix="filter"
                      ref={selectInputRefTag}
                      components={animatedComponents}
                      options={tags.map((tag) => {
                        return { value: tag.IdTag, label: tag.TagName }
                      })}
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
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm={8}></CCol>
                  <CCol sm={4}>
                    <CButton
                      color="primary"
                      className="alignRight"
                      type="submit"
                      disabled={isFetchingItems}
                    >
                      Buscar
                    </CButton>
                    <CButton
                      as="input"
                      type="reset"
                      color="secondary"
                      value="Limpiar"
                      onClick={handleReset}
                    />
                  </CCol>
                </CRow>
              </CCollapse>
            </CForm>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Resultados</strong>
          </CCardHeader>
          <CCardBody>
            {items.length === 0 && !isFetchingItems ? (
              <CCallout color="light">No aparece nada con esa búsqueda.</CCallout>
            ) : (
              <CTable striped bordered columns={columns} items={items} />
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CModal
        size="xl"
        scrollable
        visible={visibleDetailModal}
        onClose={() => toggleDetailModal(false)}
        aria-labelledby="detalles"
      >
        <CModalHeader>
          <CModalTitle id="detalles">Detalles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="w-100">
            <CCarousel
              controls={images.length > 1}
              indicators={images.length > 1}
              interval={false}
              dark
            >
              {images.length === 0 ? (
                <CCarouselItem key={0} className="fittedImageHeight">
                  <CImage
                    className="d-block"
                    align="center"
                    src={setImage(null)}
                    height={400}
                    alt="Sin imagen"
                  />
                </CCarouselItem>
              ) : (
                images.map((photo, index) => (
                  <CCarouselItem key={photo.IdPhoto} className="fittedImageHeight">
                    <CImage
                      className="d-block"
                      align="center"
                      src={setImage(photo.Image)}
                      height={400}
                      alt={`Imagen ${index + 1}`}
                    />
                  </CCarouselItem>
                ))
              )}
            </CCarousel>
            <CCardBody>
              <CCardTitle>{model.ModelName}</CCardTitle>
              <CCardText as="div">
                <CTable striped borderless columns={detailColumns} items={detailItems} />
              </CCardText>
            </CCardBody>
          </CCard>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => toggleDetailModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
      <ModalWindow
        data={deleteData}
        handleDelete={deleteElement}
        isOpen={visibleDeleteModal}
        closeDeleteModal={toggleDeleteModal}
      />
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </CRow>
  )
}

export default ModelSearch
