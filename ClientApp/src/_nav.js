import React from 'react'
import CIcon from '@coreui/icons-react'
import { cil3d, cilPencil, cilTag, cibPatreon, cilSearch } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Modelos',
    icon: <CIcon icon={cil3d} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buscar',
    to: '/models/search',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Editar',
    to: '/models/edit',
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
    to: '/patreons/search',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Editar',
    to: '/patreons/edit',
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
    to: '/tags/search',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Editar',
    to: '/tags/edit',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
