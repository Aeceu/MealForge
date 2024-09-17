import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { handleError } from "@/utils/errorHandler";
import { TUserLogin, TUserSignup } from "@/utils/types/user";

export const handleLogin = createAsyncThunk(
	"user/handleLogin",
	async (data: TUserLogin, { rejectWithValue }) => {
		try {
			const res = await axios.post("/login", data);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleSignup = createAsyncThunk(
	"user/handleSignup",
	async (data: TUserSignup, { rejectWithValue }) => {
		try {
			const res = await axios.post("/signup", data);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);
