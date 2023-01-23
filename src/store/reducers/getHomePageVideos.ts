import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../index";
import { HomePageVideos } from "../../Types";
import { parseData } from "../../utils";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;

//N สร้าง ฟั่งชั่น แบบ async
export const getHomePageVideos = createAsyncThunk(
  "youtubeApp/homePageVidoes",
  async (isNext: boolean, { getState }) => {
    ///N รับค่า จาก getState() มาใ่ห้  youtubeApp type เป็น RootState ตาม state global  
    const {
      ///N เข้าถึง youtubeApp -> nextPageToken = nextPageTokenFromState 
      ///N เข้าถึง youtubeApp ->  videos =  videos  แต่สั้นๆ ใช้ เป็น video โดยตรงเพราะใช้ชื่อนี้เลย
      youtubeApp: { videos,  nextPageToken: nextPageTokenFromState },
      /// as = ให้ a เป็น type ตาม RootState
    } = getState() as RootState;
    

    /// get ข้อมูลจาก api เข้าถึง data -> item และ data -> nextPageToken
    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?maxResults=20&q=""&key=${API_KEY}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFromState}` : ""
      }`
    );

   ///N รับค่าจาก การทำงาน มาใาส่ ใน parsedData  
    const parsedData: HomePageVideos[] = await parseData(items);
    /// ส่งค่ากลับ เป็น object parsedData = [] และ nextPageToken = nextPageToken 
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);
