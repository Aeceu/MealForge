import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { handleError } from "@/utils/errorHandler";

export const getUser = createAsyncThunk(
	"user/getUser",
	async (token: string | null, { rejectWithValue }) => {
		try {
			const res = await axios.get("/user", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			});
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);
