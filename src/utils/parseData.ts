import axios from "axios";
import {
  convertRawViewstoString,
  parseVideoDuration,
  timeSince,
} from "./index";
import { YOUTUBE_API_URL } from "./constants";
import { HomePageVideos } from "../Types";
import { SourceMap } from "module";
const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;

export const parseData = async (items: any[]) => {
  try {
    const videoIds: string[] = [];
    const channelIds: string[] = [];

  ////n  parameter ไป forEach เพื่อเก็บค่าใส่ใน videoIds และ channelIds
    items.forEach(
      ///n เลือก เข้าถึง snippet -> cheannelId และ id->videoId  
      ///n มาใส่ ใน channelIds และ vidoeIds []
      (item: { snippet: { channelId: string }; id: { videoId: string } }) => {
        channelIds.push(item.snippet.channelId);
        videoIds.push(item.id.videoId);
      }
    );


    //N รับข้อมูล จาก api มาใส่ ใน channelsData 
    /// เข้าถึง data -> items = channelsData
    const {
      data: {  items:channelsData },
    } = await axios.get(
      `${YOUTUBE_API_URL}/channels?part=snippet,contentDetails&id=${channelIds.join(",")}&key=${API_KEY}`
    );


    const parsedChannelsData: { id: string; image: string }[] = [];
    //n เอาค่า ChannelsData มาใส่ใน parsedChannelsData  เข้าถึง id type string และ 
    //N snippet -> thumbnails -> default -> url 
    channelsData.forEach(
      (channel: {
        id: string;
        snippet: { thumbnails: { default: { url: string } } };
      }) =>
        parsedChannelsData.push({
          id: channel.id,
          image: channel.snippet.thumbnails.default.url,
        })
    );


    ///N รับค่า จาก api เข้าถึง data -> items = videosData
    const {
      data: { items: videosData },
    } = await axios.get(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${API_KEY}`
    );


    ///N สร้างตัวแปร array 
    const parsedData: HomePageVideos[] = [];

    ///N เอาค่า items มาวนลูปใส่ค่า item เข้าถึง snippet -> ค่าๆ และ item เข้าถึง id -> videosId
    ///N และ item เข้าถึง index 

    items.forEach(
      (
        item: {
          snippet: {
            channelId: string;
            title: string;
            description: string;
            thumbnails: { medium: { url: string } };
            publishedAt: Date;
            channelTitle: string;
          };
          id: { videoId: string };
        },
        index: number
      ) => {
        /// เข้าถึง image จาก  parsedChannelsData = channelImage
        const { image: channelImage } = parsedChannelsData.find(
          /// check ค่าว่า ค่าไอดีตรงกันไหม
          (data) =>  data.id === item.snippet.channelId
        )!;

        ///N เช็คม่ี่ข้อมูลไหม
        if (channelImage)
        ///N เอาค่าใส่ ใน paresed ตามลำดับ
          parsedData.push({
            videoId: item.id.videoId,
            videoTitle: item.snippet.title,
            videoDescription: item.snippet.description,
            videoThumbnail: item.snippet.thumbnails.medium.url,
            videoLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            videoDuration: parseVideoDuration(
              videosData[index].contentDetails.duration
            ),
            videoViews: convertRawViewstoString(
              videosData[index].statistics.viewCount
            ),
            videoAge: timeSince(new Date(item.snippet.publishedAt)),
            channelInfo: {
              id: item.snippet.channelId,
              image: channelImage,
              name: item.snippet.channelTitle,
            },
          });
      }
    );

      //N ส่งค่ากลับ
    return parsedData;
  } catch (err) {
    console.log(err);
  }
};