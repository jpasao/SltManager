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
import { useGetPatreons, useDeletePatreon } from '../../network/hooks/patreon'
import { defaultPatreon, defaultDelete } from '../../defaults/patreon'
import { actionColumns, routeNames } from '../../defaults/global'

const PatreonSearch = () => {
  let patreonObject = defaultPatreon
  let deleteObj = defaultDelete

  const navigateTo = useNavigate()
  const { patreons, refreshPatreons, isLoading: isFetchingItems } = useGetPatreons(patreonObject)
  const { deletePatreon } = useDeletePatreon()
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [name, setName] = useState('')
  const [deleteData, setDeleteData] = useState(deleteObj)

  const isLoading = isFetchingItems

  const handleName = (event) => setName(event.target.value)
  const handleSearch = () => {
    patreonObject.PatreonName = name
    refreshPatreons()
  }

  const handleEdit = (patreon) => {
    navigateTo(routeNames.patreons.save, { state: patreon })
  }
  const handleDelete = (patreon) => {
    deleteObj.id = patreon.idPatreon
    deleteObj.name = patreon.patreonName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = () => {
    deletePatreon(deleteObj.id).then(() => refreshPatreons())
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

  const items = patreons.map((patreon) => {
    return {
      id: patreon.idPatreon,
      name: patreon.patreonName,
      actions: (
        <>
          <CButton color="warning" variant="ghost" size="sm" onClick={() => handleEdit(patreon)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDelete(patreon)}>
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
                  id="patreonName"
                  value={name}
                  onChange={handleName}
                  floatingClassName="mb-3"
                  floatingLabel="Nombre"
                  placeholder="Filtra los Patreon por nombre..."
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

export default PatreonSearch
