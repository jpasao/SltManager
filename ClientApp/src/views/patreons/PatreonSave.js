import React, { useState, useEffect, useRef } from 'react'
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
  CToaster,
} from '@coreui/react'
import { useCreatePatreon, useUpdatePatreon, useGetDependencies } from '../../network/hooks/patreon'
import { defaultPatreon } from '../../defaults/patreon'
import { routeNames } from '../../defaults/global'
import Toast from '../../components/ToastComponent'
import DependencyComponent from '../../components/DependencyComponent'

const PatreonSave = () => {
  const location = useLocation()
  const navigateTo = useNavigate()
  const editingPatreon = location.state !== null
  const method = editingPatreon ? 'put' : 'post'
  const { updatePatreon, isLoading: isUpdatingItem } = useUpdatePatreon()
  const { createPatreon, isLoading: isCreatingItem } = useCreatePatreon()
  const { getDependencies, isLoading: isGettingDependencies } = useGetDependencies()
  const [dependencies, setDependencies] = useState([])
  const [validated, setValidated] = useState(false)
  const [patreon, setPatreon] = useState(defaultPatreon)
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  let patreonToSave = defaultPatreon

  const isLoading = isCreatingItem || isUpdatingItem || isGettingDependencies

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
      async function getDependencies() {
        await checkDependencies(patreonToSave)
      }
      getDependencies()
    }
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
          (error) =>
            resultToast(
              `Hubo un problema al guardar el Patreon '${patreon.PatreonName}': ${error}`,
              'danger',
            ),
        )
      } else {
        await createPatreon(patreon).then(
          () => navigateTo(routeNames.patreons.search),
          (error) =>
            resultToast(
              `Hubo un problema al guardar el Patreon '${patreon.PatreonName}': ${error}`,
              'danger',
            ),
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
  const checkDependencies = async (patreon) => {
    await getDependencies(patreon.IdPatreon).then(
      (dependencies) => {
        setDependencies(dependencies)
      },
      (error) =>
        resultToast(
          `Hubo un problema al comprobar las dependencias del Patreon: ${error}`,
          'danger',
        ),
    )
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
              <CRow xs={{ gutter: 2 }}>
                <CCol xs={12} md={9}>
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
                <CCol xs={12} md={3}>
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
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <DependencyComponent
          name={patreon.PatreonName}
          dependencies={dependencies}
          isEditing={location.state}
        />
      </CCol>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </CRow>
  )
}

export default PatreonSave
