import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { convertRawViewstoString, timeSince } from "../../utils";

import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;



export const getVideoDetails = createAsyncThunk(
  "yotubeApp/videoDetails",
  async (id: string) => {
    //N รับค่า จาก api มา เข้าถึง data -> items 
    const {
      data: { items },
    } = await axios.get(
      `${YOUTUBE_API_URL}/videos?key=${API_KEY}&part=snippet,statistics&type=video&id=${id}`
    );
      /// return ค่า object
    return parseData(items[0]);
  }
);


/// รับค่า parameter มาแสดง onject ชื่อ item -> snippet ,item->id ,item->statistics
const parseData = async (item: {
  snippet: {
    channelId: string;
    title: string;
    description: string;
    publishedAt: Date;
    channelTitle: string;
  };
  id: string;
  statistics: { viewCount: string; likeCount: string };
}) => {

  ///N รับค่าจากการ get api เข้าถึง data -> items -> snippet , data -> items -> statistics
  const {
    data: {
      items: [
        {
          snippet: {
            thumbnails: {
              default: { url: channelImage },
            },
          },
          statistics: { subscriberCount },
        },
      ],
    },
  } = await axios.get(
    `${YOUTUBE_API_URL}/channels?part=snippet,statistics&id=${item.snippet.channelId}&key=${API_KEY}`
  );

 ////N return object กลับไป 
  return {
    videoId: item.id,
    videoTitle: item.snippet.title,
    videoDescription: item.snippet.description,
    videoViews: parseInt(item.statistics.viewCount).toLocaleString(),
    videoLikes: convertRawViewstoString(item.statistics.likeCount),
    videoAge: timeSince(new Date(item.snippet.publishedAt)),
    channelInfo: {
      id: item.snippet.channelId,
      image: channelImage,
      name: item.snippet.channelTitle,
      subscribers: convertRawViewstoString(subscriberCount, true),
    },
  };
};

