import React from 'react'
import CIcon from '@coreui/icons-react'
import { cil3d, cilPencil, cilTag, cibPatreon, cilSearch, cibCreativeCommons } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import { routeNames } from './defaults/global'

const _nav = [
  {
    component: CNavTitle,
    name: 'Modelos',
    icon: <CIcon icon={cil3d} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buscar',
    to: routeNames.models.search,
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Guardar',
    to: routeNames.models.save,
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Patreons',
    icon: <CIcon icon={cibPatreon} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buscar',
    to: routeNames.patreons.search,
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Guardar',
    to: routeNames.patreons.save,
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Colecciones',
    icon: <CIcon icon={cibCreativeCommons} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buscar',
    to: routeNames.collections.search,
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Guardar',
    to: routeNames.collections.save,
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Etiquetas',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buscar',
    to: routeNames.tags.search,
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Guardar',
    to: routeNames.tags.save,
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
