import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './views/theme/themeSlice'

export const tkStore = configureStore({
  reducer: {
    theme: themeReducer,
  },
})
