import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   id:null,
   email:null,
    loader: false,
    error:"",
}

const authSlice = createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setAuth : (state, action)=>{
            state.id = action.payload.id;
            state.email = action.payload.email
        },
        removeAuth: (state)=>{
            state.id = null;
            state.email = null
        }
    },
});


export default authSlice.reducer;
export const {setAuth, removeAuth} = authSlice.actions