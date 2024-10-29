import React from 'react'
import { routeNames } from './defaults/global'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const PatreonSearching = React.lazy(() => import('./views/patreons/PatreonSearch'))
const PatreonSaving = React.lazy(() => import('./views/patreons/PatreonSave'))
const TagSearching = React.lazy(() => import('./views/tags/TagSearch'))
const TagSaving = React.lazy(() => import('./views/tags/TagSave'))
const ModelSearching = React.lazy(() => import('./views/models/ModelSearch'))
const ModelSaving = React.lazy(() => import('./views/models/ModelSave'))
const CollectionSearching = React.lazy(() => import('./views/collections/CollectionSearch'))
const CollectionSaving = React.lazy(() => import('./views/collections/CollectionSave'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: routeNames.patreons.search, name: 'Patreons → Buscar', element: PatreonSearching },
  { path: routeNames.patreons.save, name: 'Patreons → Guardar', element: PatreonSaving },
  // eslint-disable-next-line prettier/prettier
  { path: routeNames.collections.search, name: 'Colecciones → Buscar', element: CollectionSearching },
  { path: routeNames.collections.save, name: 'Colecciones → Guardar', element: CollectionSaving },
  { path: routeNames.tags.search, name: 'Etiquetas → Buscar', element: TagSearching },
  { path: routeNames.tags.save, name: 'Etiquetas → Guardar', element: TagSaving },
  { path: routeNames.models.search, name: 'Modelos → Buscar', element: ModelSearching },
  { path: routeNames.models.save, name: 'Modelos → Guardar', element: ModelSaving },
]

export default routes
