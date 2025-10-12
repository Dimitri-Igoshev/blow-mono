import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface ISearch {
  search: {
    online: string;
    withPhoto: string;
    sex: string;
    minage: string;
    maxage: string;
    city: string;
    limit: string;
  };
}

const INITIAL_STATE: ISearch = {
  search: {
    online: "",
    withPhoto: "",
    sex: "",
    minage: "",
    maxage: "",
    city: "",
    limit: "12",
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState: INITIAL_STATE,
  reducers: {
    setSearch: (state, action: PayloadAction<any>) => {
      state.search = action.payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
