import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const handleLogin = createAsyncThunk(
	"user/handleLogin",
	async (data, { rejectWithValue }) => {
		try {
			const res = await axios.post("/login", data);
			return res.data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);
