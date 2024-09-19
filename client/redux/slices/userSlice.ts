import { createSlice } from "@reduxjs/toolkit";
import {
	handleLogin,
	handleLogout,
	handleRefresh,
	handleSignup,
} from "../actions/userActions";

type TInitialState = {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		userName: string;
		email: string;
	} | null;
	accessToken: string | null;
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: any | null;
};

const initialState: TInitialState = {
	user: null,
	accessToken: null,
	status: "idle",
	pageLoading: false,
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
				state.error = action.payload as string;
			})
			.addCase(handleSignup.pending, (state) => {
				state.status = "pending";
			})
			.addCase(handleSignup.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(handleSignup.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})
			.addCase(handleRefresh.pending, (state, action) => {
				state.pageLoading = true;
			})
			.addCase(handleRefresh.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.pageLoading = false;
				state.error = null;
			})
			.addCase(handleRefresh.rejected, (state, action) => {
				state.pageLoading = false;
				state.error = action.payload as string;
			})
			.addCase(handleLogout.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(handleLogout.fulfilled, (state, action) => {
				state.user = null;
				state.accessToken = null;
				state.status = "completed";
				state.error = null;
			})
			.addCase(handleLogout.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			});
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
