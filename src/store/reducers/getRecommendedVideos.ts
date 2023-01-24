import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { RecommendedVideos } from "../../Types";
import { parseRecommendedData } from "../../utils/parseRecommendedData";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
  "yotubeApp/getRecommendedVideos",
  async (videoId: string, { getState }) => {
    ///n set ค่า  จาก state global เข้า ถึง youtubeApp -> currentPlaying -> ChannelInfo -> id  =  channelId
    const {
      youtubeApp: {
        currentPlaying: {
          channelInfo: { id: channelId },
        },
      },
    } = getState() as RootState;

    ///N รับค่า จาก api เข้าถึง data -> items
    const {
      data: { items },
    } = await axios.get(
      `${YOUTUBE_API_URL}/activities?key=${API_KEY}&channelId=${channelId}&part=snippet,contentDetails&maxResults=20&type=video&videoId=${videoId}`
    );

      
    const parsedData: RecommendedVideos[] = await parseRecommendedData(
      items,
      videoId
    );

    return { parsedData };
  }
);