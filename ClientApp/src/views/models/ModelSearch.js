import React, { useState } from 'react'
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
  CFormSelect,
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
  CListGroup,
  CListGroupItem,
  CBadge,
  CCallout,
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
  useGetModelYears,
  useDeleteModel,
  useOpenFolder,
  useGetPhotos,
} from '../../network/hooks/model'
import { useGetPatreons } from '../../network/hooks/patreon'
import { useGetTags } from '../../network/hooks/tag'
import { defaultModel, defaultDelete, months } from '../../defaults/model'
import { defaultPatreon } from '../../defaults/patreon'
import { defaultTag } from '../../defaults/tag'
import { actionColumns, routeNames } from '../../defaults/global'
import NoImage from '../../../public/no-image.png'

const ModelSearch = () => {
  let modelObject = defaultModel
  let deleteObj = defaultDelete

  const { models, refreshModels, isLoading: isFetchingItems } = useGetModels(modelObject)
  const { deleteModel } = useDeleteModel()
  const { modelYears } = useGetModelYears()
  const { patreons } = useGetPatreons(defaultPatreon)
  const { getPhotos } = useGetPhotos(0)
  const { openFolder } = useOpenFolder()
  const { tags } = useGetTags(defaultTag)
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [visibleDetailModal, setVisibleDetailModal] = useState(false)
  const [name, setName] = useState('')
  const [year, setYear] = useState(0)
  const [years, setYears] = useState([])
  const [month, setMonth] = useState(0)
  const [patreon, setPatreon] = useState(0)
  const [model, setModel] = useState(defaultModel)
  const [images, setImages] = useState([])
  const [tag, setTag] = useState(0)
  const [deleteData, setDeleteData] = useState(deleteObj)

  const isLoading = isFetchingItems

  if (years.length === 0 && isLoading) {
    modelYears().then((data) => setYears(data))
  }

  const handleName = (event) => setName(event.target.value)
  const handleYear = (event) => setYear(event.target.value)
  const handleMonth = (event) => setMonth(event.target.value)
  const handlePatreon = (event) => setPatreon(event.target.value)
  const handleTag = (event) => setTag(event.target.value)

  const handleSearch = () => {
    modelObject.ModelName = name
    modelObject.Year = year
    modelObject.Month = month
    modelObject.Patreon.IdPatreon = patreon
    modelObject.Tag[0].IdTag = tag
    refreshModels()
  }

  const handleReset = () => {
    setName('')
    setYear(0)
    setMonth(0)
    setPatreon(0)
    setTag(0)
  }
  const handleEdit = (model) => {}
  const handleDelete = (model) => {
    deleteObj.id = model.idModel
    deleteObj.name = model.modelName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = () => {
    deleteModel(deleteObj.id).then(() => refreshModels())
    toggleDeleteModal(false)
  }
  const handleView = (model) => {
    setModel(model)
    getPhotos(model.idModel).then((photos) => {
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
    return months.find((month) => month.value === monthNumber)?.name
  }

  const handleOpenFolder = (path) => {
    const pathObj = { path: path }
    openFolder(pathObj)
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
      id: model.idModel,
      name: model.modelName,
      patreon: model.patreon.patreonName,
      year: model.year,
      month: model.month,
      monthName: getMonthName(model.month),
      images: model.image,
      image: <CImage rounded src={setImage(model)} width={30} height={30} />,
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
                    <CFormSelect
                      id="year"
                      value={year}
                      onChange={handleYear}
                      floatingLabel="Año"
                      placeholder="Filtra los modelos por año..."
                    >
                      <option value="0">Selecciona un año...</option>
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
                      value={month}
                      onChange={handleMonth}
                      floatingLabel="Mes"
                      placeholder="Filtra los modelos por mes..."
                    >
                      <option value="0">Selecciona un mes...</option>
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
                    <CFormSelect
                      id="patreon"
                      value={patreon}
                      onChange={handlePatreon}
                      floatingLabel="Patreon"
                      placeholder="Filtra los modelos por patreon..."
                    >
                      <option value="0">Selecciona un patreon...</option>
                      {patreons.map((patreon) => (
                        <option key={patreon.idPatreon} value={patreon.idPatreon}>
                          {patreon.patreonName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <CFormSelect
                      id="tag"
                      value={tag}
                      onChange={handleTag}
                      floatingLabel="Etiqueta"
                      placeholder="Filtra los modelos por etiqueta..."
                    >
                      <option value="0">Selecciona una etiqueta...</option>
                      {tags.map((tag) => (
                        <option key={tag.idTag} value={tag.idTag}>
                          {tag.tagName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <CButton
                      as="input"
                      type="reset"
                      color="secondary"
                      value="Limpiar"
                      onClick={handleReset}
                    />
                    <CButton
                      color="primary"
                      className="alignRight"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      Buscar
                    </CButton>
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
        aria-labelledby="OptionalSizesExample1"
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample1">Detalles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="w-100">
            <CCarousel controls indicators interval={false} transition="crossfade">
              {images.length === 0 ? (
                <CCarouselItem key={0} className="fittedImageHeight">
                  <CImage
                    className="d-block"
                    align="center"
                    src={setImage(null)}
                    height={600}
                    fluid
                    alt="Sin imagen"
                  />
                </CCarouselItem>
              ) : (
                images.map((photo, index) => (
                  <CCarouselItem key={photo.idPhoto} className="fittedImageHeight">
                    <CImage
                      className="d-block"
                      align="center"
                      src={setImage(photo.image)}
                      height={600}
                      fluid
                      alt={`Imagen ${index + 1}`}
                    />
                  </CCarouselItem>
                ))
              )}
            </CCarousel>
            <CCardBody>
              <CCardTitle>{model.modelName}</CCardTitle>
              <CCardText>
                <CListGroup flush>
                  <CListGroupItem>
                    <CRow>
                      <CCol xs={2}>Fecha:</CCol>
                      <CCol xs={10}>
                        {getMonthName(model.month)} de {model.year}
                      </CCol>
                    </CRow>
                  </CListGroupItem>
                  <CListGroupItem>
                    <CRow>
                      <CCol xs={2}>Ruta:</CCol>
                      <CCol xs={10}>
                        <CButton
                          color="link"
                          onClick={() => handleOpenFolder(model.path)}
                          style={{ marginLeft: '-12px' }}
                        >
                          {model.path}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CListGroupItem>
                  <CListGroupItem>
                    <CRow>
                      <CCol xs={2}>Patreon:</CCol>
                      <CCol xs={10}>{model.patreon?.patreonName}</CCol>
                    </CRow>
                  </CListGroupItem>
                  <CListGroupItem>
                    <CRow>
                      <CCol xs={2}>Etiquetas:</CCol>
                      <CCol xs={10}>
                        {model.tag?.map((tag) => (
                          <CBadge key={tag.idTag} color="secondary" style={{ marginRight: '5px' }}>
                            {tag.tagName}
                          </CBadge>
                        ))}
                      </CCol>
                    </CRow>
                  </CListGroupItem>
                </CListGroup>
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
    </CRow>
  )
}

export default ModelSearch
