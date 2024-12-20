import React, { useState, useEffect, useRef } from 'react'
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
  CCallout,
  CToaster,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretTop, cilCaretBottom, cilPencil, cilTrash } from '@coreui/icons'
import ModalWindow from '../../components/ModalComponent'
import { useGetTags, useDeleteTag } from '../../network/hooks/tag'
import { defaultTag, defaultDelete } from '../../defaults/tag'
import {
  actionColumns,
  routeNames,
  itemsPerTable,
  getPagedItems,
  getItemsPerPage,
  saveItemsPerPage,
} from '../../defaults/global'
import Toast from '../../components/ToastComponent'
import Pager from '../../components/PagerComponent'

const TagSearch = () => {
  let tagObject = defaultTag
  let deleteObj = defaultDelete

  const navigateTo = useNavigate()
  const { tags, refreshTags, isLoading: isFetchingItems } = useGetTags(tagObject)
  const { deleteTag, isLoading: isDeletingItem } = useDeleteTag()
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [name, setName] = useState('')
  const [deleteData, setDeleteData] = useState(deleteObj)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const isLoading = isFetchingItems || isDeletingItem
  useEffect(() => {
    const savedItemsPerPage = async () =>
      await getItemsPerPage().then(() => {
        setPager(savedItemsPerPage)
      })
  }, [])

  useEffect(() => {
    if (tags instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos: ${tags.info.message} ${tags.info.data}`,
        'danger',
      )
    }
  }, [tags])

  const setPager = (itemNumber) => {
    saveItemsPerPage(itemNumber)
    setCurrentPage(1)
    setItemsPerPage(itemNumber)
  }

  const pagedItems = getPagedItems(tags, currentPage, itemsPerPage)
  const handleChangeTableRows = (event) => {
    setPager(event.target.value)
  }

  const handleName = (event) => setName(event.target.value)
  const handleSearch = () => {
    tagObject.TagName = name
    refreshTags()
  }

  const handleReset = () => setName('')
  const handleEdit = (tag) => {
    navigateTo(routeNames.tags.save, { state: tag })
  }
  const handleDelete = (tag) => {
    deleteObj.id = tag.IdTag
    deleteObj.name = tag.TagName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = async () => {
    await deleteTag(deleteObj.id).then(
      () => {
        if ((tags.length - 1) % itemsPerPage === 0) {
          setCurrentPage(1)
        }
        refreshTags()
        resultToast(`La etiqueta '${deleteObj.name}' se ha borrado correctamente`, 'primary')
      },
      (error) =>
        resultToast(
          `Hubo un problema al borrar la etiqueta '${deleteObj.name}': ${error}`,
          'danger',
        ),
    )
    toggleDeleteModal(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      _props: { scope: 'col' },
    },
    ...actionColumns,
  ]

  const items = pagedItems?.map((tag) => {
    return {
      id: tag.IdTag,
      name: tag.TagName,
      actions: (
        <>
          <CButton color="warning" variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDelete(tag)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
    }
  })

  const pager = tags && tags.length > itemsPerPage && (
    <Pager
      itemsPerPage={itemsPerPage}
      totalItems={tags.length}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
    />
  )
  const spinner = (
    <div className="pt-3 text-center">
      <CSpinner color="primary" variant="grow" />
    </div>
  )
  const view = (
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
                  <CCol xs={12} md={9}>
                    <CFormInput
                      type="text"
                      id="tagName"
                      value={name}
                      onChange={handleName}
                      floatingClassName="mb-3"
                      floatingLabel="Nombre"
                      placeholder="Filtra las Etiquetas por nombre..."
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
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
            <label className="alignRight">
              <span>Filas por página: </span>
              <select className="tableRow" onChange={handleChangeTableRows} value={itemsPerPage}>
                {itemsPerTable.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </CCardHeader>
          <CCardBody>
            {items?.length === 0 && !isLoading ? (
              <CCallout color="light">No aparece nada con esa búsqueda.</CCallout>
            ) : (
              <>
                <CTable striped bordered columns={columns} items={items} responsive="sm" />
                {pager}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <ModalWindow
        data={deleteData}
        handleDelete={deleteElement}
        isOpen={visibleDeleteModal}
        closeDeleteModal={toggleDeleteModal}
      />
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </CRow>
  )

  return <>{isLoading ? spinner : view}</>
}

export default TagSearch
