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

const itemsPerTable = [5, 10, 20, 50, 100]
const getPagedItems = (items, currentPage, itemsPerPage) => {
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  return items.slice(firstItemIndex, lastItemIndex)
}
const saveItemsPerPage = (number) => {
  localStorage.setItem('itemsPerPage', number)
}
const getItemsPerPage = () => {
  const items = localStorage.getItem('itemsPerPage')
  if (items === null) {
    const defaultItems = itemsPerTable[1].toString()
    saveItemsPerPage(defaultItems)
    return defaultItems
  }
  return items
}

export {
  actionColumns,
  routeNames,
  invalidSelectMessage,
  serverUrl,
  itemsPerTable,
  getPagedItems,
  getItemsPerPage,
  saveItemsPerPage,
}
