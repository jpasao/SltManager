import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ModalWindow = (props) => {
  const { data, handleDelete, isOpen, closeDeleteModal } = props
  const { name, page } = data
  return (
    <CModal visible={isOpen} onClose={() => closeDeleteModal(false)} aria-labelledby="deleteModal">
      <CModalHeader>
        <CModalTitle id="deleteModal">Se va a borrar un elemento de {page}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Vas a borrar {name} de {page}. ¿Estás seguro?
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => closeDeleteModal(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleDelete}>
          Aceptar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ModalWindow
