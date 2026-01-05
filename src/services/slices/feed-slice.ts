import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  lastUpdate: null
};

export const fetchFeedOrders = createAsyncThunk(
  'feed/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: TFeedState };
      const lastUpdate = state.feed.lastUpdate;
      const now = Date.now();

      // Кэшируем на 10 секунд
      if (lastUpdate && now - lastUpdate < 10000) {
        const { orders, total, totalToday } = state.feed;
        return { orders, total, totalToday, timestamp: now };
      }

      const response = await getFeedsApi();
      return { ...response, timestamp: now };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateFeed: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.lastUpdate = Date.now();
    },
    clearFeedError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.lastUpdate = action.payload.timestamp;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateFeed, clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
