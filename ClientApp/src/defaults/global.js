const serverUrl = import.meta.env.VITE_SERVER_URL
const actionColumns = [
  {
    key: 'actions',
    label: 'Acciones',
    _props: { colSpan: 2, scope: 'colgroup' },
    _style: { width: '10%' },
  },
]
const pages = ['models', 'patreons', 'tags', 'collections']
const routeNames = {}
const actions = { search: 'search', save: 'save' }
for (let page of pages) {
  routeNames[page] = {
    search: `/${page}/${actions.search}`,
    save: `/${page}/${actions.save}`,
  }
}
const invalidSelectMessage = 'invalid-select-message'

export { actionColumns, routeNames, invalidSelectMessage, serverUrl }
