import { configureStore } from '@reduxjs/toolkit'
import { AllFoldersReducer, currentFolderReducer, userReducer } from './UserSlice'

const store = configureStore({
    reducer: {
        loginUser: userReducer,
        currentFolder: currentFolderReducer,
        FolderStore: AllFoldersReducer
    }
})

export default store