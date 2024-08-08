import React from 'react'
import PatreonSearch from './views/patreons/search/PatreonSearch'
import PatreonSave from './views/patreons/save/PatreonSave'
import { routeNames } from './defaults/global'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: routeNames.patreons.search, name: 'Patreon → Buscar', element: PatreonSearch },
  { path: routeNames.patreons.save, name: 'Patreon → Guardar', element: PatreonSave },
]

export default routes
