import { configureStore } from "@reduxjs/toolkit";
import indexSlice from "./slices/indexSlice";
import rememberedDevicesSlice from "./slices/rememberedDevicesSlice";

export const store = configureStore({
  reducer: {
    index: indexSlice,
    rememberedDevices: rememberedDevicesSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
