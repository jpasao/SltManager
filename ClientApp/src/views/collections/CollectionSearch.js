import React, { useState, useEffect, useRef } from 'react'
import CreatableSelect from 'react-select/creatable'
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
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretTop, cilCaretBottom, cilPencil, cilTrash } from '@coreui/icons'
import ModalWindow from '../../components/ModalComponent'
import { useGetCollections, useDeleteCollection } from '../../network/hooks/collection'
import { useGetPatreons, useCreatePatreon } from '../../network/hooks/patreon'
import { defaultCollection, defaultDelete } from '../../defaults/collection'
import { defaultPatreon } from '../../defaults/patreon'
import {
  actionColumns,
  routeNames,
  itemsPerTable,
  getPagedItems,
  getItemsPerPage,
  saveItemsPerPage,
} from '../../defaults/global'
import Toast from '../../components/ToastComponent'
import Pager from '../../components/PagerComponent'

const CollectionSearch = () => {
  let deleteObj = defaultDelete
  let selectInputRefPatreon = useRef()

  const navigateTo = useNavigate()
  const [search, setSearch] = useState(defaultCollection)
  const { collections, refreshCollections, isLoading: isFetchingItems } = useGetCollections(search)
  const { deleteCollection, isLoading: isDeletingItem } = useDeleteCollection()
  const { patreons, refreshPatreons } = useGetPatreons(defaultPatreon)
  const { createPatreon } = useCreatePatreon()
  const [visible, setVisible] = useState(true)
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [name, setName] = useState('')
  const [patreon, setPatreon] = useState(0)
  const [deleteData, setDeleteData] = useState(deleteObj)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const isLoading = isFetchingItems || isDeletingItem
  useEffect(() => {
    const savedItemsPerPage = async () =>
      await getItemsPerPage().then(() => {
        setPager(savedItemsPerPage)
        setSearch(defaultCollection)
      })
  }, [])

  useEffect(() => {
    if (collections instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos: ${collections.info.message} ${collections.info.data}`,
        'danger',
      )
    }
  }, [collections])

  const setPager = (itemNumber) => {
    saveItemsPerPage(itemNumber)
    setCurrentPage(1)
    setItemsPerPage(itemNumber)
  }

  const pagedItems = getPagedItems(collections, currentPage, itemsPerPage)
  const handleChangeTableRows = (event) => {
    setPager(event.target.value)
  }

  const handleName = (event) => setName(event.target.value)
  const handlePatreon = (event) => setPatreon(event?.value || event?.target.innerText || 0)

  const handleSearch = () => {
    refreshSearchParams()
    refreshCollections()
  }

  const refreshSearchParams = () => {
    const defaultClone = JSON.parse(JSON.stringify(defaultCollection))
    const newSearch = {
      ...defaultClone,
      CollectionName: name,
      Patreon: { IdPatreon: patreon },
    }
    setSearch(newSearch)
  }
  const cleanSearchParams = () => {
    const defaultClone = JSON.parse(JSON.stringify(defaultCollection))
    setSearch(defaultClone)
  }
  const handleReset = () => {
    setName('')
    setPatreon(0)
    selectInputRefPatreon.current.clearValue()
    cleanSearchParams()
  }

  const handleEdit = (collection) => {
    navigateTo(routeNames.collections.save, { state: collection })
  }
  const handleDelete = (collection) => {
    deleteObj.id = collection.IdCollection
    deleteObj.name = collection.CollectionName
    setDeleteData(deleteObj)
    toggleDeleteModal(true)
  }
  const toggleDeleteModal = (visible) => {
    setVisibleDeleteModal(visible)
  }
  const deleteElement = async () => {
    await deleteCollection(deleteObj.id).then(
      () => {
        if ((collections.length - 1) % itemsPerPage === 0) {
          setCurrentPage(1)
        }
        refreshCollections()
        resultToast(`La colección '${deleteObj.name}' se ha borrado correctamente`, 'primary')
      },
      (error) =>
        resultToast(
          `Hubo un problema al borrar la colección '${deleteObj.name}': ${error}`,
          'danger',
        ),
    )
    toggleDeleteModal(false)
  }
  const handleCreatePatreon = async (patreonName) => {
    const newPatreon = { IdPatreon: 0, PatreonName: patreonName }
    await createPatreon(newPatreon).then(
      () => {
        refreshPatreons()
        resultToast(`El Patreon '${patreonName}' se ha guardado correctamente`, 'primary')
      },
      (error) =>
        resultToast(`Hubo un problema al guardar el Patreon '${patreonName}: ${error}'`, 'danger'),
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      _props: { scope: 'col' },
    },
    {
      key: 'patreon',
      label: 'Patreon',
      _props: { scope: 'col' },
    },
    ...actionColumns,
  ]

  const items = pagedItems?.map((collection) => {
    return {
      id: collection.IdCollection,
      name: collection.CollectionName,
      patreon: collection.Patreon.PatreonName,
      actions: (
        <>
          <CButton color="warning" variant="ghost" size="sm" onClick={() => handleEdit(collection)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton
            color="danger"
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(collection)}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
    }
  })

  const pager = collections && collections.length > itemsPerPage && (
    <Pager
      itemsPerPage={itemsPerPage}
      totalItems={collections.length}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
    />
  )
  const spinner = (
    <div className="pt-3 text-center">
      <CSpinner color="primary" variant="grow" />
    </div>
  )
  const view = (
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
                  <CCol xs={5}>
                    <CFormInput
                      type="text"
                      id="collectionName"
                      value={name}
                      onChange={handleName}
                      floatingClassName="mb-3"
                      floatingLabel="Nombre"
                      placeholder="Filtra las colecciones por nombre..."
                    />
                  </CCol>
                  <CCol xs={4}>
                    <CreatableSelect
                      id="patreon"
                      classNamePrefix="filter"
                      ref={selectInputRefPatreon}
                      options={patreons.map((patreon) => {
                        return { value: patreon.IdPatreon, label: patreon.PatreonName }
                      })}
                      isLoading={patreons.length == 0}
                      formatCreateLabel={(term) => `Crear nuevo Patreon '${term}'`}
                      onCreateOption={handleCreatePatreon}
                      onChange={handlePatreon}
                      placeholder="Selecciona un patreon..."
                      isClearable={true}
                    />
                    <label className="form-select-label" htmlFor="patreon">
                      Patreon
                    </label>
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
                      disabled={isLoading}
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
            <label className="alignRight">
              <span>Filas por página: </span>
              <select className="tableRow" onChange={handleChangeTableRows} value={itemsPerPage}>
                {itemsPerTable.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </CCardHeader>
          <CCardBody>
            {items?.length === 0 && !isLoading ? (
              <CCallout color="light">No aparece nada con esa búsqueda.</CCallout>
            ) : (
              <>
                <CTable striped bordered columns={columns} items={items} />
                {pager}
              </>
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

  return <>{isLoading ? spinner : view}</>
}

export default CollectionSearch
