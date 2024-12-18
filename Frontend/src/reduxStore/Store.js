import { configureStore } from '@reduxjs/toolkit'
import { AllFoldersReducer, currentFolderReducer, userReducer } from './UserSlice'

const store = configureStore({
    reducer: {
        loginUser: userReducer,
        currentFolder: currentFolderReducer,
        AllFolder: AllFoldersReducer
    }
})

export default store