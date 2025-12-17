import { createSlice } from '@reduxjs/toolkit';

interface QueryState {}

const initialState: QueryState = {};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {},
});

export default querySlice.reducer;
