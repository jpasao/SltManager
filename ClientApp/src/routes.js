import React from 'react'
import { routeNames } from './defaults/global'
import PatreonSearch from './views/patreons/PatreonSearch'
import PatreonSave from './views/patreons/PatreonSave'
import TagSearch from './views/tags/TagSearch'
import TagSave from './views/tags/TagSave'
import ModelSearch from './views/models/ModelSearch'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: routeNames.patreons.search, name: 'Patreons → Buscar', element: PatreonSearch },
  { path: routeNames.patreons.save, name: 'Patreons → Guardar', element: PatreonSave },
  { path: routeNames.tags.search, name: 'Etiquetas → Buscar', element: TagSearch },
  { path: routeNames.tags.save, name: 'Etiquetas → Guardar', element: TagSave },
  { path: routeNames.models.search, name: 'Modelos → Buscar', element: ModelSearch },
]

export default routes
