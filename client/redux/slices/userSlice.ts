import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../actions/userActions";

type TInitialState = {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		userName: string;
		email: string;
	} | null;
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: any | null;
};

const initialState: TInitialState = {
	user: null,
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
			.addCase(getUser.pending, (state, action) => {
				state.pageLoading = true;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.pageLoading = false;
				state.user = action.payload;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.pageLoading = false;
				state.error = action.error.message;
			});
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
