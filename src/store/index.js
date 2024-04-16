import {configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/reducer"


const rootReducer = combineReducers({auth});

const store = configureStore({reducer: rootReducer})

export default store