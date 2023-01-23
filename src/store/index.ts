import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

import { InitialState } from "../Types";
import { getHomePageVideos } from "./reducers/getHomePageVideos";
import { getRecommendedVideos } from "./reducers/getRecommendedVideos";
import { getSearchPageVideos } from "./reducers/getSearchPageVideos";
import { getVideoDetails } from "./reducers/getVideoDetails";

const initialState: InitialState = {
  //n สร้างตัว state global 
  videos: [],
  currentPlaying: null,
  searchTerm: "",
  searchResults: [],
  nextPageToken: null,
  recommendedVideos: [],
};

//n สร้าง slice reducer
const YoutubeSlice = createSlice({
  //N ชื่อ ไว้อ้างอิง
  name: "youtubeApp",
  ///n state global
  initialState,
  //n ฟั่งชั่น แบบ sync
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = null;
    },
    changeSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
    },
  },
  //n ฟั่งชั่น แบบ async
  extraReducers: (builder) => {
    /// fulfilled = ทำฟังชั่น getHomePageVideos สำเร็จ 
    builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
      ///N รับค่า action จาก ฟังชั่น getHomePageVideos มา ใส่ videos และ nextPageToken
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });

    builder.addCase(getSearchPageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });

    builder.addCase(getVideoDetails.fulfilled, (state, action) => {
      state.currentPlaying = action.payload;
    });

    builder.addCase(getRecommendedVideos.fulfilled, (state, action) => {
      state.recommendedVideos = action.payload.parsedData;
    });

  },
});

export const store = configureStore({
  reducer: {
    youtubeApp: YoutubeSlice.reducer,
  },
});

export const { clearVideos, changeSearchTerm, clearSearchTerm } =
  YoutubeSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;