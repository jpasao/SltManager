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
import { useCreateTag, useUpdateTag } from '../../network/hooks/tag'
import { defaultTag } from '../../defaults/tag'
import { routeNames } from '../../defaults/global'

const TagSave = () => {
  const location = useLocation()
  const navigateTo = useNavigate()
  const editingTag = location.state !== null
  const method = editingTag ? 'put' : 'post'
  const { updateTag, isLoading: isUpdatingItem } = useUpdateTag()
  const { createTag, isLoading: isCreatingItem } = useCreateTag()
  const [validated, setValidated] = useState(false)
  const [tag, setTag] = useState(defaultTag)

  const isLoading = isCreatingItem || isUpdatingItem
  let tagToSave = defaultTag

  useEffect(() => {
    if (editingTag) {
      tagToSave = structuredClone(location.state)
      tagToSave = Object.assign(
        {},
        {
          IdTag: tagToSave.IdTag,
          TagName: tagToSave.TagName,
        },
      )
    }
    setTag(tagToSave)
  }, [defaultTag])

  if (!editingTag && tag.IdTag !== 0) {
    setTag(defaultTag)
  }

  const handleSave = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      if (editingTag) {
        await updateTag(tag).then(
          () => navigateTo(routeNames.tags.search),
          (error) =>
            resultToast(
              `Hubo un problema al guardar la etiqueta '${tag.TagName}: ${error}'`,
              'danger',
            ),
        )
      } else {
        await createTag(tag).then(
          () => navigateTo(routeNames.tags.search),
          (error) =>
            resultToast(
              `Hubo un problema al guardar la etiqueta '${tag.TagName}: ${error}'`,
              'danger',
            ),
        )
      }
    }
    setValidated(true)
    return false
  }
  const handleName = (event) => {
    const { TagName, ...rest } = tag
    const modifiedTag = { TagName: event.target.value, ...rest }
    setTag(modifiedTag)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editingTag ? 'Editar' : 'Crear'}</strong>
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
                id="tagName"
                name="tagName"
                value={tag.TagName}
                onChange={handleName}
                feedbackInvalid="¿Qué es una etiqueta sin un nombre?"
                floatingClassName="mb-3"
                floatingLabel="Nombre"
                placeholder="Nombre de la Etiqueta"
                required
              />
              <CButton color="primary" className="alignRight" type="submit" disabled={isLoading}>
                Guardar
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TagSave
