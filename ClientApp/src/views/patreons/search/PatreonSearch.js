import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { useGetPatreons } from '../../../network/hooks/patreon'

const PatreonSearch = () => {
  let patreonObject = { IdPatreon: 0, PatreonName: '' }
  const { patreons, refreshPatreons, isLoading: isFetchingItems } = useGetPatreons(patreonObject)

  const isLoading = isFetchingItems

  const handleSearch = (search = false) => {
    if (search) {
      refreshPatreons()
    }
  }

  const sortedPatreons = patreons.length
    ? patreons.sort((a, b) => a.patreonName - b.patreonName)
    : []

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Filtros</strong>
          </CCardHeader>
          <CCardBody>
            <CButton color="primary" onClick={() => handleSearch(true)} disabled={isLoading}>
              Buscar
            </CButton>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Resultados</strong>
          </CCardHeader>
          <CCardBody>
            <ul>
              {sortedPatreons.map((patreon) => (
                <li key={patreon.idPatreon}>{patreon.patreonName}</li>
              ))}
            </ul>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PatreonSearch
