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
  CCallout,
  CBadge,
} from '@coreui/react'
import { useCreatePatreon, useUpdatePatreon } from '../../network/hooks/patreon'
import { useGetCollections } from '../../network/hooks/collection'
import { defaultCollection } from '../../defaults/collection'
import { defaultPatreon } from '../../defaults/patreon'
import { routeNames } from '../../defaults/global'

const PatreonSave = () => {
  const patreonCollection = defaultCollection
  const location = useLocation()
  const navigateTo = useNavigate()
  const editingPatreon = location.state !== null
  const method = editingPatreon ? 'put' : 'post'
  const { updatePatreon, isLoading: isUpdatingItem } = useUpdatePatreon()
  const { createPatreon, isLoading: isCreatingItem } = useCreatePatreon()
  const { collections, refreshCollections } = useGetCollections(patreonCollection)
  const [validated, setValidated] = useState(false)
  const [patreon, setPatreon] = useState(defaultPatreon)
  let patreonToSave = defaultPatreon

  const isLoading = isCreatingItem || isUpdatingItem

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
    const idPatreon = patreonToSave.IdPatreon === 0 ? -1 : patreonToSave.IdPatreon
    patreonCollection.Patreon.IdPatreon = idPatreon
    refreshCollections()
    setPatreon(patreonToSave)
  }, [defaultPatreon])

  if (!editingPatreon && patreon.IdPatreon !== 0) {
    setPatreon(defaultPatreon)
  }
  const handleSave = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      if (editingPatreon) {
        await updatePatreon(patreon).then(
          () => navigateTo(routeNames.patreons.search),
          (reason) => console.error('the reason:', reason),
        )
      } else {
        await createPatreon(patreon).then(
          () => navigateTo(routeNames.patreons.search),
          (error) => resultToast(`Hubo un problema al guardar el Patreon: ${error}`, 'danger'),
        )
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
  const collectionOutput =
    collections.length === 0 ? (
      ''
    ) : (
      <CCol>
        <span>Colecciones: </span>
        <CCallout color="light">
          {collections.map((collection) => (
            <CBadge key={collection.IdCollection} color="secondary" style={{ marginRight: '5px' }}>
              {collection.CollectionName}
            </CBadge>
          ))}
        </CCallout>
      </CCol>
    )

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
              <CRow xs={{ gutter: 2 }}>
                <CCol xs={9}>
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
                </CCol>
                <CCol xs={3}>
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
              <CRow>{collectionOutput}</CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PatreonSave
