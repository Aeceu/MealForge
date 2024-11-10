import { createSlice } from "@reduxjs/toolkit";
import {
	createPost,
	getPostById,
	getPosts,
	getUserPosts,
} from "../actions/postAction";
import { RecipePost } from "@/utils/types/post";

type TInitialState = {
	post: RecipePost[];
	userPost: RecipePost[];
	status: "idle" | "pending" | "completed" | "failed";
	error: any | null;
	pageLoading: boolean;
};

const initialState: TInitialState = {
	post: [],
	userPost: [],
	status: "idle",
	error: null,
	pageLoading: false,
};

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPost: (state, action) => {
			state.post = action.payload;
		},
		setUserPost: (state, action) => {
			state.userPost = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createPost.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(createPost.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(createPost.rejected, (state, action) => {
				state.status = "failed";
			})
			.addCase(getPosts.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(getPosts.fulfilled, (state, action) => {
				state.status = "completed";
				state.post = action.payload;
			})
			.addCase(getPosts.rejected, (state, action) => {
				state.status = "failed";
			})
			.addCase(getPostById.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(getPostById.fulfilled, (state, action) => {
				state.status = "completed";
			})
			.addCase(getPostById.rejected, (state, action) => {
				state.status = "failed";
			})
			.addCase(getUserPosts.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(getUserPosts.fulfilled, (state, action) => {
				state.status = "completed";
				state.userPost = action.payload;
			})
			.addCase(getUserPosts.rejected, (state, action) => {
				state.status = "failed";
			});
	},
});

export const { setPost, setUserPost } = postSlice.actions;
export default postSlice.reducer;
