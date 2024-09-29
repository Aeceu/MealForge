import { handleError } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";
import { clearToken } from "../slices/authSlice";
import { router } from "expo-router";

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

export const editUser = createAsyncThunk(
	"user/EditUser",
	async (
		data: {
			userId: string;
			email: string;
			userName: string;
			firstName: string;
			lastName: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(`/user/${data.userId}`, {
				userName: data.userName,
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
			});
			Alert.alert(res.data.message);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const changePassword = createAsyncThunk(
	"user/changePassword",
	async (
		data: {
			id: string;
			currentPassword: string;
			newPassword: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(`/user/password/${data.id}`, {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			Alert.alert(res.data.message);
		} catch (error) {
			const resError = handleError(error);
			console.log("resError");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const deleteAccount = createAsyncThunk(
	"user/deleteAccount",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/user/${userId}`);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);
