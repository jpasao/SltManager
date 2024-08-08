const actionColumns = [
  {
    key: 'actions',
    label: 'Acciones',
    _props: { colSpan: 2, scope: 'colgroup' },
    _style: { width: '9%' },
  },
]

const pages = ['models', 'patreons', 'tags']
const routeNames = {}
const actions = { search: 'search', save: 'save' }
pages.map((page) => {
  routeNames[page] = {
    search: `/${page}/${actions.search}`,
    save: `/${page}/${actions.save}`,
  }
})

export { actionColumns, routeNames }
