import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import profile from "./Profile";
import token from "./token";
import { thunk } from "redux-thunk";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["token", "profile"],
};
const rootReducers = combineReducers({
  token,
  profile,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);
export { persistor, store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
