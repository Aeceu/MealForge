import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import authSlice from "./slices/authSlice";

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
	reducer: {
		user: userSlice,
		auth: persistedAuthReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
