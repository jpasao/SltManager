import React, { useState, useRef } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretTop, cilCaretBottom, cilPencil, cilTrash } from '@coreui/icons'
import ModalWindow from '../../components/ModalComponent'
import { useGetPatreons, useDeletePatreon } from '../../network/hooks/patreon'
import { defaultPatreon, defaultDelete } from '../../defaults/patreon'
import { actionColumns, routeNames } from '../../defaults/global'
import Toast from '../../components/ToastComponent'

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
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const handleName = (event) => setName(event.target.value)
  const handleSearch = () => {
    patreonObject.PatreonName = name
    refreshPatreons()
  }

  const handleReset = () => setName('')
  const handleEdit = (patreon) => {
    navigateTo(routeNames.patreons.save, { state: patreon })
  }
  const handleDelete = (patreon) => {
    deleteObj.id = patreon.IdPatreon
    deleteObj.name = patreon.PatreonName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = () => {
    deletePatreon(deleteObj.id).then(
      () => {
        refreshPatreons()
        resultToast(`El Patreon '${deleteObj.name}' se ha borrado correctamente`, 'primary')
      },
      () => resultToast(`Hubo un problema al borrar el Patreon '${deleteObj.name}'`, 'danger'),
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

  const items = patreons.map((patreon) => {
    return {
      id: patreon.IdPatreon,
      name: patreon.PatreonName,
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
                <CRow xs={{ gutter: 2 }}>
                  <CCol xs={9}>
                    <CFormInput
                      type="text"
                      id="patreonName"
                      value={name}
                      onChange={handleName}
                      floatingClassName="mb-3"
                      floatingLabel="Nombre"
                      placeholder="Filtra los Patreon por nombre..."
                    />
                  </CCol>
                  <CCol xs>
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
                      disabled={isFetchingItems}
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

export default PatreonSearch
