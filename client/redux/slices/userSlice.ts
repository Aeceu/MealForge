import { createSlice } from "@reduxjs/toolkit";
import { handleLogin, handleSignup } from "../actions/userActions";

type TInitialState = {
	user: string | null;
	accessToken: string | null;
	status: "idle" | "pending" | "completed" | "failed";
	error: any | null;
};

const initialState: TInitialState = {
	user: null,
	accessToken: null,
	status: "idle",
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(handleLogin.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(handleLogin.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.status = "completed";
				state.error = null;
			})
			.addCase(handleLogin.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(handleSignup.pending, (state) => {
				state.status = "pending";
			})
			.addCase(handleSignup.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(handleSignup.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
