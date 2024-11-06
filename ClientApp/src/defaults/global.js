const serverUrl = import.meta.env.VITE_SERVER_URL
const actionColumns = [
  {
    key: 'actions',
    label: 'Acciones',
    _props: { colSpan: 2, scope: 'colgroup' },
    _style: { width: '7%' },
  },
]
const extendedActionColumns = [
  {
    key: 'actions',
    label: 'Acciones',
    _props: { colSpan: 2, scope: 'colgroup' },
    _style: { width: '12.4%' },
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

const itemsPerTable = [5, 10, 20, 50, 100]
const getPagedItems = (items, currentPage, itemsPerPage) => {
  if (items === undefined || items.length === 0 || items instanceof Error) return
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  return items.slice(firstItemIndex, lastItemIndex)
}
const saveItemsPerPage = (number) => {
  localStorage.setItem('itemsPerPage', number)
}
const getItemsPerPage = async () => {
  const items = localStorage.getItem('itemsPerPage')
  if (items === null) {
    const defaultItems = itemsPerTable[1].toString()
    saveItemsPerPage(defaultItems)
    return await defaultItems
  }
  return await items
}
const returnResponse = (response) => {
  if (response instanceof Error || response?.StatusCode !== 200) {
    throw new Error(response?.info?.message || 'An error occurred')
  }
  return response.Value
}

export {
  actionColumns,
  extendedActionColumns,
  routeNames,
  invalidSelectMessage,
  serverUrl,
  itemsPerTable,
  getPagedItems,
  getItemsPerPage,
  saveItemsPerPage,
  returnResponse,
}
