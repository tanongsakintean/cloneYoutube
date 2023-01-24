import axios from "axios";
import {
  convertRawViewstoString,
  parseVideoDuration,
  timeSince,
} from "./index";
import { YOUTUBE_API_URL } from "./constants";
import { Item, RecommendedVideos } from "../Types";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;

export const parseRecommendedData = async (items: Item[], videoId: string) => {
  try {
    const videoIds: string[] = [];
    const channelIds: string[] = [];
    const newItems: Item[] = [];

    ///N วนลูป set ค่า ของ channelIds.push()
    items.forEach((item: Item) => {
      channelIds.push(item.snippet.channelId);

      ///N เช็คว่าค่าว่างไหม 
      if (item.contentDetails?.upload?.videoId) {
        ///N set ค่า เข้าอาเรย์ videoIds[]
        videoIds.push(item.contentDetails.upload.videoId);
        ///N set ค่า เข้าอาเรย์ newItems[]
        newItems.push(item);
      }
    });

    ////N รับค่า จาก api เข้าถึง data -> items = videosData
    const {
      data: { items: videosData },
    } = await axios.get(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${API_KEY}`
    );

    //n สร้าง array  object 
    const parsedData: RecommendedVideos[] = [];

    /// วนลูป ค่า newItems  มาใส่ ค่า array 
    newItems.forEach((item, index) => {
      /// ถ้าเป็น video เดียวกัน return เลย
      if (index >= videosData.length) return;

      /// ถ้าเป็น video เดียวกัน return เลย
      if (videoId === item?.contentDetails?.upload?.videoId) return;

      ///n set ค่า array parsedData เข้า อาเรย์
      parsedData.push({
        videoId: item.contentDetails.upload.videoId,
        videoTitle: item.snippet.title,
        videoThumbnail: item.snippet.thumbnails.medium.url,
        videoDuration: parseVideoDuration(
          videosData[index].contentDetails.duration
        ),
        videoViews: convertRawViewstoString(
          videosData[index].statistics.viewCount
        ),
        videoAge: timeSince(new Date(item.snippet.publishedAt)),
        channelInfo: {
          id: item.snippet.channelId,
          name: item.snippet.channelTitle,
        },
      });
    });

    ///N สงค่ากลับ array object 
    return parsedData;
  } catch (err) {
    console.log(err);
  }
};