import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { handleError } from "@/utils/errorHandler";
import { TUserLogin, TUserSignup } from "@/utils/types/user";
import { Alert } from "react-native";
import { router } from "expo-router";

export const handleLogin = createAsyncThunk(
	"user/handleLogin",
	async (data: TUserLogin, { rejectWithValue }) => {
		try {
			const res = await axios.post("/signin", data);
			console.log(Alert.alert("SUCCESS"));
			router.navigate("/(app)/home");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
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
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleShowCookie = createAsyncThunk(
	"user/handleShowCookie",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/showcookie");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleLogout = createAsyncThunk(
	"user/handleLogout",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/logout");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleRefresh = createAsyncThunk(
	"user/handleRefresh",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/refresh");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);
