import { createSlice } from "@reduxjs/toolkit";
import {
	changePassword,
	deleteAccount,
	editUser,
	getUser,
} from "../actions/userActions";
import { TUser } from "@/utils/types/user";
import { TIngredients } from "@/utils/types/ingredients";
import { addIngredients, getIngredients } from "../actions/ingredientsAction";

type TInitialState = {
	user: TUser | null;
	ingredients: TIngredients[];
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: any | null;
};

const initialState: TInitialState = {
	user: null,
	ingredients: [],
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
			})
			.addCase(editUser.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(editUser.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(editUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(changePassword.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(deleteAccount.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(deleteAccount.fulfilled, (state, action) => {
				state.status = "completed";
				state.user = null;
			})
			.addCase(deleteAccount.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getIngredients.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(getIngredients.fulfilled, (state, action) => {
				state.status = "completed";
				state.ingredients = action.payload.ingredients;
			})
			.addCase(getIngredients.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addIngredients.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(addIngredients.fulfilled, (state, action) => {
				state.status = "completed";
				state.ingredients.push(action.payload.ingredient);
			})
			.addCase(addIngredients.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
