import { handleError } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";

type TCreatePostProps = {
	user_id: string;
	recipe_name: string;
};

export const createPost = createAsyncThunk(
	"post/createPost",
	async ({ recipe_name, user_id }: TCreatePostProps, { rejectWithValue }) => {
		try {
			const res = await axios.post(
				`/user/${user_id}/recipe/${recipe_name}/create_post`
			);
			console.log(res.data);
			Alert.alert(res.data.message);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getPostById = createAsyncThunk(
	"post/getPostById",
	async (postId: string | string[], { rejectWithValue }) => {
		try {
			const res = await axios.get(`/post/${postId}`);
			return res.data.post;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getPosts = createAsyncThunk(
	"post/getPosts",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/posts");
			return res.data.posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getUserPosts = createAsyncThunk(
	"post/getUserPosts",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/${userId}/posts`);
			return res.data.user_posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);
