import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  connection: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'connection':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
