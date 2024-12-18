import { configureStore } from '@reduxjs/toolkit'
import { currentFolderReducer, userReducer } from './UserSlice'

const store = configureStore({
    reducer: {
        loginUser: userReducer,
        currentFolder: currentFolderReducer
    }
})

export default store