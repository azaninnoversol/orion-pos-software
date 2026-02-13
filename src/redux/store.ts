// redux
import { configureStore } from "@reduxjs/toolkit";
import { locationApi } from "./locationApi/locationApi";
import orderDrawerReducer from "./OrderDrawerSlice/OrderDrawerSlice";
import themeReducer from "./Theme/Theme";

export const store = configureStore({
  reducer: {
    orderDrawer: orderDrawerReducer,
    themeSlice: themeReducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(locationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
