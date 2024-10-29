import React, { useState, useEffect, useRef } from 'react'
import CreatableSelect from 'react-select/creatable'
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
import { useCreateCollection, useUpdateCollection } from '../../network/hooks/collection'
import { useGetPatreons, useCreatePatreon } from '../../network/hooks/patreon'
import { defaultCollection } from '../../defaults/collection'
import { defaultPatreon } from '../../defaults/patreon'
import { routeNames, invalidSelectMessage } from '../../defaults/global'
import Toast from '../../components/ToastComponent'

const CollectionSave = () => {
  const location = useLocation()
  const navigateTo = useNavigate()
  const { updateCollection, isLoading: isUpdatingItem } = useUpdateCollection()
  const { createCollection, isLoading: isCreatingItem } = useCreateCollection()
  const { patreons, refreshPatreons } = useGetPatreons(defaultPatreon)
  const { createPatreon } = useCreatePatreon()
  const [validated, setValidated] = useState(false)
  const selectClass = useRef({})
  const selectErrorMessage = useRef({})
  const [collection, setCollection] = useState(defaultCollection)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const isLoading = isCreatingItem || isUpdatingItem

  let collectionToSave = defaultCollection
  const editingCollection = location.state !== null
  const method = editingCollection ? 'put' : 'post'
  const selectFormFields = ['Patreon']

  useEffect(() => {
    if (editingCollection) {
      collectionToSave = structuredClone(location.state)
      collectionToSave = Object.assign(
        {},
        {
          IdCollection: collectionToSave.IdCollection,
          CollectionName: collectionToSave.CollectionName,
          Patreon: collectionToSave.Patreon,
        },
      )
    }
    setCollection(collectionToSave)
  }, [defaultCollection])

  if (!editingCollection && collection.IdCollection !== 0) {
    setCollection(defaultCollection)
  }

  const handleName = (event) => {
    const { CollectionName, ...rest } = collection
    const modifiedCollection = { CollectionName: event.target.value, ...rest }
    setCollection(modifiedCollection)
  }
  const handlePatreon = (event) => {
    const { Patreon, ...rest } = collection
    const sentData = event?.value || event?.target.innerText || 0
    const modifiedCollection = {
      Patreon: { IdPatreon: sentData, PatreonName: event?.label },
      ...rest,
    }
    validateSelects(sentData, validated, 'patreon')
    setCollection(modifiedCollection)
  }
  const checkSelectsAreValid = () => {
    let allFieldsFilled = true
    for (let selectField of selectFormFields) {
      let collectionValue = collection[selectField].IdPatreon

      allFieldsFilled = allFieldsFilled && collectionValue
      validateSelects(collectionValue, true, selectField.toLowerCase())
    }
    return !!allFieldsFilled
  }
  const validateSelects = (value, isFormValidated, field) => {
    if (!isFormValidated) return
    const displayValue = value ? 'none' : 'block'
    const classValue = value ? 'valid' : 'error'

    selectErrorMessage.current[field] = {}
    selectErrorMessage.current[field].display = displayValue
    selectClass.current[field] = classValue
  }
  const handleCreatePatreon = async (patreonName) => {
    const newPatreon = { IdPatreon: 0, PatreonName: patreonName }
    await createPatreon(newPatreon).then(
      () => {
        refreshPatreons()
        resultToast(`El Patreon '${patreonName}' se ha guardado correctamente`, 'primary')
      },
      (error) =>
        resultToast(`Hubo un problema al guardar el Patreon '${patreonName}': ${error}`, 'danger'),
    )
  }
  const handleSave = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    let selectsAreValid = checkSelectsAreValid()
    setValidated(true)
    if (form.checkValidity() === false || selectsAreValid === false) {
      event.stopPropagation()
      return
    }
    if (editingCollection) {
      await updateCollection(collection).then(
        () => navigateTo(routeNames.collections.search),
        (error) =>
          resultToast(
            `Hubo un problema al guardar la colección '${collection.CollectionName}': ${error}`,
            'danger',
          ),
      )
    } else {
      await createCollection(collection).then(
        () => navigateTo(routeNames.collections.search),
        (error) =>
          resultToast(
            `Hubo un problema al guardar la colección '${collection.CollectionName}': ${error}`,
            'danger',
          ),
      )
    }
    return false
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingCollection ? 'Editar' : 'Crear'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="g-3 needs-validation"
              noValidate
              validated={validated}
              method={method}
              onSubmit={handleSave}
            >
              <CRow>
                <CCol xs={8}>
                  <CFormInput
                    type="text"
                    id="collectionName"
                    name="collectionName"
                    value={collection.CollectionName}
                    onChange={handleName}
                    feedbackInvalid="¿Dónde se ha visto una colección sin un nombre?"
                    floatingClassName="mb-3"
                    floatingLabel="Nombre"
                    placeholder="Nombre de la colección"
                    required
                  />
                </CCol>
                <CCol xs={4}>
                  <CreatableSelect
                    id="patreon"
                    classNamePrefix="filter"
                    className={selectClass.current.patreon}
                    options={patreons.map((patreon) => {
                      return { value: patreon.IdPatreon, label: patreon.PatreonName }
                    })}
                    value={
                      collection.Patreon.IdPatreon === 0
                        ? null
                        : patreons
                            .map((patreon) => {
                              return { value: patreon.IdPatreon, label: patreon.PatreonName }
                            })
                            .find((option) => option.value === collection.Patreon.IdPatreon)
                    }
                    isLoading={patreons.length == 0}
                    formatCreateLabel={(term) => `Crear nuevo Patreon '${term}'`}
                    onCreateOption={handleCreatePatreon}
                    onChange={handlePatreon}
                    placeholder="Selecciona un patreon..."
                    isClearable={true}
                    hideSelectedOptions={true}
                  />
                  <label className="form-select-label" htmlFor="patreon">
                    Patreon
                  </label>
                  <div style={selectErrorMessage.current.patreon} className={invalidSelectMessage}>
                    Esta colección está un poquito huérfana sin ningún Patreon...
                  </div>
                </CCol>
                <CCol>
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
    </CRow>
  )
}

export default CollectionSave
