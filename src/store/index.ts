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
    /// Set state global ให้ว่าง 
    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = null;
    },

    ///N set string ของ state global searchTerm เอาไว้ ใช้ค้นหา
    changeSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    ///N เคลียร์ ค่า state global searchTerm ให้ว่าง 
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
    })  
    //N ทำงานเมือมีการ search videos จะเรียกใช้งาน getSearchPageVideos เมื่อสำเร็จ จะ 
    //n เอาค่ามาใส่ใน state global  
    builder.addCase(getSearchPageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });

    ///N ทำงาน ฟังชั่น getVideoDetails แล้วเอาค่ามาใส่ currentPlaying = action.payload
    builder.addCase(getVideoDetails.fulfilled, (state, action) => {
      state.currentPlaying = action.payload;
    });

    ///N ทำงาน ฟังชั่น getRecommendedVideos แล้วเอาค่า มาใส่ recommededVideos 
    builder.addCase(getRecommendedVideos.fulfilled, (state, action) => {
      ///N set ค่า state global  ผ่าน action.payload.parsedData
      state.recommendedVideos = action.payload.parsedData;
    });

  },
});

///N ยัด reduer YoutubeSlice เข้า store
export const store = configureStore({
  reducer: {
    youtubeApp: YoutubeSlice.reducer,
  },
});

/// เอาออกไปใข้ ข้างนอก
export const { clearVideos, changeSearchTerm, clearSearchTerm } = YoutubeSlice.actions;
/// type ของ state global
export type RootState = ReturnType<typeof store.getState>;
/// type ของ  เอาไว้เรียกใช้งานฟังชั่น 
export type AppDispatch = typeof store.dispatch;