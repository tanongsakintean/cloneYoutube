import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { HomePageVideos } from "../../Types";
import { parseData } from "../../utils";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;

export const getSearchPageVideos = createAsyncThunk(
  "youtubeApp/searchPageVidoes",
  async (isNext: boolean, { getState }) => {
    ///N รับค่าจาก rootstate มาใส่
    ///N เข้าถึง youtubeApp -> nextPageToken = nextPageTokenFromState 
    ///N เข้าถึง youtubeApp -> videos = videos
    ///N เข้าถึง youtubeApp -> searchTerm = searchTerm
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos,searchTerm },
    } = getState() as RootState;

    ///n รับค่าจาก api เข้าถึง data -> items , เข้าถึง data -> nextPageToken  ที่เกิดจากการค้นหา
    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?q=${searchTerm}&key=${API_KEY}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFromState}` : ""
      }`
    );

   ///N รับค่าจาก การทำงาน มาใส่ ใน parsedData  
    const parsedData: HomePageVideos[] = await parseData(items);
    /// ส่งค่ากลับ เป็น object parsedData = [] และ nextPageToken = nextPageToken 
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);