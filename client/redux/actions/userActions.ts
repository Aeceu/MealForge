import { handleError } from "@/utils/errorHandler";
import { TUserLogin, TUserSignup } from "@/utils/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../slices/userSlice";

// export const handleLogin = createAsyncThunk(
// 	"auth/handleLogin",
// 	async (data: TUserLogin, { rejectWithValue }) => {
// 		try {
// 			const res = await axios.post("/signin", data);
// 			await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
// 			console.log(Alert.alert("SUCCESS"));
// 			router.navigate("/(app)/home");
// 			return res.data;
// 		} catch (error) {
// 			const resError = handleError(error);
// 			console.log("resError:", resError);
// 			return rejectWithValue(resError);
// 		}
// 	}
// );

// export const handleSignup = createAsyncThunk(
// 	"auth/handleSignup",
// 	async (data: TUserSignup, { rejectWithValue }) => {
// 		try {
// 			const res = await axios.post("/signup", data);
// 			return res.data;
// 		} catch (error) {
// 			const resError = handleError(error);
// 			console.log("resError:", resError);
// 			return rejectWithValue(resError);
// 		}
// 	}
// );

// export const handleShowCookie = createAsyncThunk(
// 	"auth/handleShowCookie",
// 	async (_, { rejectWithValue }) => {
// 		try {
// 			const res = await axios.get("/showcookie");
// 			return res.data;
// 		} catch (error) {
// 			const resError = handleError(error);
// 			console.log("resError:", resError);
// 			return rejectWithValue(resError);
// 		}
// 	}
// );

// export const handleLogout = createAsyncThunk(
// 	"auth/handleLogout",
// 	async (token: string | null, { rejectWithValue }) => {
// 		try {
// 			const res = await axios.get("/logout", {
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				},
// 			});
// 			await AsyncStorage.removeItem("refreshToken");
// 			router.push("/(auth)/login");
// 			return res.data;
// 		} catch (error) {
// 			const resError = handleError(error);
// 			console.log(resError);
// 			return rejectWithValue(resError);
// 		}
// 	}
// );

// export const handleRefresh = createAsyncThunk(
// 	"auth/handleRefresh",
// 	async (token: string | null, { rejectWithValue, dispatch }) => {
// 		try {
// 			const res = await axios.get("/refresh", {
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				},
// 			});
// 			return res.data;
// 		} catch (error) {
// 			const resError = handleError(error);
// 			console.log(resError);
// 			return rejectWithValue(resError);
// 		}
// 	}
// );

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
			console.log(res.data);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);
