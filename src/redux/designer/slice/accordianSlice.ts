import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import AWS_SCHEMAS from '@/schema/aws/schema';

export interface IFilteredAwsServices {
  [key: string]: Array<string>;
}

export type AccordianState = {
  query: string;
  filteredAwsServices: IFilteredAwsServices | null;
};

export const accordianSlice = createSlice({
  name: 'accordian',
  initialState: {
    query: null as string | null,
    filteredAwsServices: null as IFilteredAwsServices | null,
  } as AccordianState,
  reducers: {
    setQuery: (state: AccordianState, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    applyQuery: (state: AccordianState) => {
      if (state.query == '') {
        state.filteredAwsServices = null;
        return;
      }
      const unsafeQuery = state.query.replace(/[\s-_]/g, '').toLowerCase();
      const filteredAwsServices: IFilteredAwsServices = {};
      Object.keys(AWS_SCHEMAS).forEach((category) => {
        Object.keys(AWS_SCHEMAS[category]).forEach((service) => {
          if (
            service
              .replace(/[\s-_]/g, '')
              .toLowerCase()
              .startsWith(unsafeQuery)
          ) {
            if (!filteredAwsServices[category]) {
              filteredAwsServices[category] = [];
            }
            filteredAwsServices[category].push(service);
          }
        });
      });
      state.filteredAwsServices = filteredAwsServices;
    },
    removeQuery: (state: AccordianState) => {
      state.query = '';
    },
  },
  extraReducers: () => {},
});

export const { setQuery, applyQuery, removeQuery } = accordianSlice.actions;

export const selectQuery = (state: RootState) => state.accordian.query;
export const selectFilteredAwsServices = (state: RootState) =>
  state.accordian.filteredAwsServices;

export const accordianReducer = accordianSlice.reducer;
