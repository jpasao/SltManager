import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CForm,
} from '@coreui/react'
import { useCreatePatreon, useUpdatePatreon } from '../../network/hooks/patreon'
import { defaultPatreon } from '../../defaults/patreon'
import { routeNames } from '../../defaults/global'

const PatreonSave = () => {
  const location = useLocation()
  const navigateTo = useNavigate()
  const editingPatreon = location.state !== null
  const method = editingPatreon ? 'put' : 'post'
  const { updatePatreon } = useUpdatePatreon()
  const { createPatreon } = useCreatePatreon()
  const [validated, setValidated] = useState(false)
  const [patreon, setPatreon] = useState(defaultPatreon)
  let patreonToSave = defaultPatreon

  useEffect(() => {
    if (editingPatreon) {
      patreonToSave = structuredClone(location.state)
      patreonToSave = Object.assign(
        {},
        {
          IdPatreon: patreonToSave.IdPatreon,
          PatreonName: patreonToSave.PatreonName,
        },
      )
    }
    setPatreon(patreonToSave)
  }, [defaultPatreon])

  if (!editingPatreon && patreon.IdPatreon !== 0) {
    setPatreon(defaultPatreon)
  }
  const handleSave = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      if (editingPatreon) {
        updatePatreon(patreon).then(
          () => navigateTo(routeNames.patreons.search),
          (reason) => console.error('the reason:', reason),
        )
      } else {
        createPatreon(patreon).then(() => navigateTo(routeNames.patreons.search))
      }
    }
    setValidated(true)
    return false
  }
  const handleName = (event) => {
    const { PatreonName, ...rest } = patreon
    const modifiedPatreon = { PatreonName: event.target.value, ...rest }
    setPatreon(modifiedPatreon)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingPatreon ? 'Editar' : 'Crear'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="g-3 needs-validation"
              noValidate
              validated={validated}
              method={method}
              onSubmit={handleSave}
            >
              <CFormInput
                type="text"
                id="patreonName"
                name="patreonName"
                value={patreon.PatreonName}
                onChange={handleName}
                feedbackInvalid="¿Qué es un patreon sin un nombre?"
                floatingClassName="mb-3"
                floatingLabel="Nombre"
                placeholder="Nombre del Patreon"
                required
              />
              <CButton color="primary" className="alignRight" type="submit">
                Guardar
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PatreonSave
