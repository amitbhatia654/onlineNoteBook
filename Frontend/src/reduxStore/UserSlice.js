import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => JSON.parse(localStorage.getItem("user")) || {};
const getCurrentFolder = () => JSON.parse(localStorage.getItem("current_folder")) || {};
const getAllStoredFolders = () => JSON.parse(localStorage.getItem("allFolders")) || []


const userSlice = createSlice({
    name: "userDetails",
    initialState: getUserFromLocalStorage(),
    reducers: {
        add(state, action) {
            return action.payload;
        },
        remove() {
            return {};
        },
    },
});

const currentFolderSlice = createSlice({
    name: "currentFolder",
    initialState: getCurrentFolder,
    reducers: {
        addFolder(state, action) {
            return action.payload;
        },
        removeFolder() {
            return {};
        },
    },
});

const allFolderSlice = createSlice({
    name: "AllFolders",
    initialState: getAllStoredFolders,
    reducers: {
        addAllFolders(state, action) {
            return action.payload
        },
        removeAllFolders(state, action) {
            return action.payload
        }

    }
})

export const { add: addUser, remove: removeUser } = userSlice.actions;
export const { addFolder, removeFolder } = currentFolderSlice.actions;
export const { addAllFolders, removeAllFolders } = allFolderSlice.actions;

export const userReducer = userSlice.reducer;
export const currentFolderReducer = currentFolderSlice.reducer;
export const AllFoldersReducer = allFolderSlice.reducer

