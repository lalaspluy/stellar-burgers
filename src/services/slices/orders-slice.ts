import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi, getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  currentOrder: TOrder | null;
  userOrders: TOrder[];
  feedOrders: TOrder[];
  orderRequest: boolean;
  orderFailed: boolean;
  error: string | null;
  total: number;
  totalToday: number;
}

const initialState: OrdersState = {
  currentOrder: null,
  userOrders: [],
  feedOrders: [],
  orderRequest: false,
  orderFailed: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFeedOrders = createAsyncThunk(
  'orders/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderRequest = false;
      state.orderFailed = false;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
        state.orderFailed = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderFailed = true;
        state.error = (action.payload as string) || 'Ошибка создания заказа';
        state.currentOrder = null;
      })
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка загрузки заказов';
      })
      // fetchFeedOrders
      .addCase(fetchFeedOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const { clearCurrentOrder, clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
