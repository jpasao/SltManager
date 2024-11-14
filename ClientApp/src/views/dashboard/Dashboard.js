import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CToaster, CSpinner } from '@coreui/react'
import { CChartLine, CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import {
  useGetOverview,
  useGetModel,
  useGetPatreon,
  useGetTag,
} from '../../network/hooks/dashboard'
import Toast from '../../components/ToastComponent'

const Dashboard = () => {
  const { overviewData, refreshOverview, isLoading: isFetchingOverview } = useGetOverview()
  const { modelData, refreshModel, isLoading: isFetchingModel } = useGetModel()
  const { patreonData, refreshPatreon, isLoading: isFetchingPatreon } = useGetPatreon()
  const { tagData, refreshTag, isLoading: isFetchingTag } = useGetTag()
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const resultToast = (message, color) =>
    addToast(<Toast message={message} color={color} push={toast} refProp={toaster} />)

  const isLoading = isFetchingOverview || isFetchingPatreon || isFetchingTag || isFetchingModel

  useEffect(() => {
    if (overviewData instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos generales: ${overviewData.info.message} ${overviewData.info.data}`,
        'danger',
      )
    }
    if (modelData instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos de los modelos: ${modelData.info.message} ${modelData.info.data}`,
        'danger',
      )
    }
    if (patreonData instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos de Patreons: ${patreonData.info.message} ${patreonData.info.data}`,
        'danger',
      )
    }
    if (tagData instanceof Error) {
      resultToast(
        `Hubo un problema al obtener los datos de etiquetas: ${tagData.info.message} ${tagData.info.data}`,
        'danger',
      )
    }
  }, [overviewData, modelData, patreonData, tagData])

  const getColor = (quantity) => {
    const colors = []
    const makeColor = (colorNum, colors) => {
      if (colors <= 1) return (100 * Math.random()) % 360
      else return (colorNum * (360 / colors)) % 360
    }
    const getRandomColor = (i, quantity) =>
      `hsl(${makeColor(i, quantity)},${25 + 70 * Math.random()}%,${65 + 10 * Math.random()}%`
    for (let i = 0; i < quantity; i++) {
      colors.push(getRandomColor(i, quantity))
    }
    return colors
  }
  const overviewChartData = {
    labels: overviewData.map((element) => element.Category),
    datasets: [
      {
        label: 'Cantidad',
        backgroundColor: getColor(1),
        data: overviewData.map((element) => element.Quantity),
      },
    ],
  }
  const modelChartData = {
    labels: modelData.map((element) => element.Category),
    borderWidth: 2,
    fill: true,
    datasets: [
      {
        label: 'Cantidad',
        backgroundColor: getColor(1),
        borderColor: getColor(1),
        data: modelData.map((element) => element.Quantity),
      },
    ],
  }
  const modelChartOptions = {
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }
  const patreonChartData = {
    labels: patreonData.map((element) => element.Category),
    datasets: [
      {
        label: 'Modelos',
        backgroundColor: getColor(patreonData.length),
        data: patreonData.map((element) => element.Quantity),
      },
    ],
  }
  const tagChartData = {
    labels: tagData.map((element) => element.Category),
    datasets: [
      {
        label: 'Modelos',
        backgroundColor: getColor(tagData.length),
        data: tagData.map((element) => element.Quantity),
      },
    ],
  }

  const spinner = (
    <div className="pt-3 text-center">
      <CSpinner color="primary" variant="grow" />
    </div>
  )

  const view = (
    <>
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de elementos</CCardHeader>
            <CCardBody>
              <CChartBar data={overviewChartData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de modelos por mes</CCardHeader>
            <CCardBody>
              <CChartLine data={modelChartData} options={modelChartOptions} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de modelos por Patreon</CCardHeader>
            <CCardBody>
              <CChartDoughnut data={patreonChartData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de modelos por Etiqueta</CCardHeader>
            <CCardBody>
              <CChartDoughnut data={tagChartData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      </CRow>
    </>
  )
  return <>{isLoading ? spinner : view}</>
}

export default Dashboard
