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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretTop, cilCaretBottom, cilPencil, cilTrash } from '@coreui/icons'
import ModalWindow from '../../components/ModalComponent'
import { useGetTags, useDeleteTag } from '../../network/hooks/tag'
import { defaultTag, defaultDelete } from '../../defaults/tag'
import { actionColumns, routeNames } from '../../defaults/global'

const TagSearch = () => {
  let tagObject = defaultTag
  let deleteObj = defaultDelete

  const navigateTo = useNavigate()
  const { tags, refreshTags, isLoading: isFetchingItems } = useGetTags(tagObject)
  const { deleteTag } = useDeleteTag()
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [name, setName] = useState('')
  const [deleteData, setDeleteData] = useState(deleteObj)

  const isLoading = isFetchingItems

  const handleName = (event) => setName(event.target.value)
  const handleSearch = () => {
    tagObject.TagName = name
    refreshTags()
  }

  const handleEdit = (tag) => {
    navigateTo(routeNames.tags.save, { state: tag })
  }
  const handleDelete = (tag) => {
    deleteObj.id = tag.idTag
    deleteObj.name = tag.tagName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = () => {
    deleteTag(deleteObj.id).then(() => refreshTags())
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

  const items = tags.map((tag) => {
    return {
      id: tag.idTag,
      name: tag.tagName,
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
                <CFormInput
                  type="text"
                  id="tagName"
                  value={name}
                  onChange={handleName}
                  floatingClassName="mb-3"
                  floatingLabel="Nombre"
                  placeholder="Filtra las Etiquetas por nombre..."
                />
                <CButton
                  color="primary"
                  className="alignRight"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  Buscar
                </CButton>
              </CCollapse>
            </CForm>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Resultados</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped bordered columns={columns} items={items} />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalWindow
        data={deleteData}
        handleDelete={deleteElement}
        isOpen={visibleDeleteModal}
        closeDeleteModal={toggleDeleteModal}
      />
    </CRow>
  )
}

export default TagSearch
