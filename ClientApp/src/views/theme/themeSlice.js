import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  connection: false,
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    colorChanged: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { colorChanged } = themeSlice.actions

export default themeSlice.reducer
