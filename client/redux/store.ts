import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import authSlice, { TInitialState } from "./slices/authSlice";
import ingredientSlice from "./slices/ingredientsSlice";

const authTransform = createTransform<TInitialState, TInitialState>(
	(inboundState: TInitialState): TInitialState => {
		return {
			...inboundState,
			pageLoading: false,
		};
	},
	(outboundState: TInitialState): TInitialState => {
		return {
			...outboundState,
			pageLoading: false,
		};
	},
	{ whitelist: ["auth"] }
);

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	transforms: [authTransform],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		user: userSlice,
		ingredients: ingredientSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
