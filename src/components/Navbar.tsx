import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsYoutube, BsCameraVideo, BsBell } from "react-icons/bs";
import { TiMicrophone } from "react-icons/ti";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { clearVideos, changeSearchTerm, clearSearchTerm } from "../store";
import { getHomePageVideos } from "../store/reducers/getHomePageVideos";
import { getSearchPageVideos } from "../store/reducers/getSearchPageVideos";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.youtubeApp.searchTerm);
  const handleSearch = () => {
    if (location.pathname != "/search") {
      navigate("/search");
    } else {
      dispatch(clearVideos());
      dispatch(getSearchPageVideos(false));
    }
  };

  return (
    <div className="flex justify-between items-center  px-14 h-14 bg-[#212121]  opacity-95 sticky top-0 ">
      <div className="flex gap-8 items-center text-2xl ">
        <div>
          <GiHamburgerMenu />
        </div>
        <Link to="/">
          <div className="flex gap-1 items-center justify-center ">
            <BsYoutube className="text-3xl text-red-600" />
            <span className="text-xl font-medium ">YouTube</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center h-10 justify-center gap-5 ">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="flex bg-zinc-900 items-center h-10 px-4 pr-0">
            <div className="flex gap-4 items-center pr-5 ">
              <div>
                <AiOutlineSearch className="text-xl " />
              </div>

              <input
                type="text"
                className="w-96 bg-zinc-900 focus:outline-none border-none "
                value={searchTerm}
                onChange={(e) => dispatch(changeSearchTerm(e.target.value))}
              />
              <AiOutlineClose
                className={`text-xl cursor-pointer ${
                  !searchTerm ? "invisible" : "visible"
                }`}
                onClick={() => dispatch(clearSearchTerm())}
              />
            </div>
            <button className="h-10 w-16 flex items-center  justify-center bg-zinc-800">
              <AiOutlineSearch className="text-xl" />
            </button>
          </div>
        </form>
        <div className="text-xl p-3 bg-zinc-900 rounded-full ">
          <TiMicrophone />
        </div>
      </div>

      <div className="flex gap-5 items-center text-xl ">
        <BsCameraVideo />
        <div className="relative">
          <BsBell />
          <span className=" absolute bottom-2 left-2 text-xs bg-red-600 rounded-full px-1">
            9+
          </span>
        </div>
        <img
          src="https://scontent.fbkk5-6.fna.fbcdn.net/v/t39.30808-1/320395735_2408541702619511_4875304421170626805_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeHpY12fhcp60EWewS4EE_B5tGWAdsgT3U20ZYB2yBPdTVpGLzkGsp4jdE_L5X8L_8eosoXPtPYmbc7Nl5dklVVb&_nc_ohc=UL_u9GNkCocAX_5AQzp&_nc_ht=scontent.fbkk5-6.fna&oh=00_AfB10b6w4b_78-LqNZqnWaiqpNmLE4kVtbkLy1oyWyvoSA&oe=63CCF966"
          className="w-9 h-9 rounded-full"
          alt="logo"
        />
      </div>
    </div>
  );
}
