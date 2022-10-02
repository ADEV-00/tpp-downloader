import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../public/logo.svg";
import ThemeSwitch from "../components/ThemeSwitch/themeSwtch";
const Home: NextPage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState("" as string);
  const [loading, setloading] = useState<boolean>(false);

  const handleSubmitPorfile = async () => {
    //check if the link include trovo.com or not
    if (
      !profileUrl.startsWith("https://") ||
      !profileUrl.includes("trovo.live/s/") ||
      profileUrl === "https://trovo.live/s/"
    ) {
      toast.error("Please enter a valid URL");
      return;
    }

    setloading(true);
    try {
      const res = await fetch("/api/get-profile-picture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: profileUrl,
        }),
      }).then((res) => res.json());

      setProfileImage(res.image);
      setloading(false);
    } catch (err: any) {
      console.log(err);
      setloading(false);
      toast.error("Error while fetching profile picture");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileUrl(e.target.value);
  };

  const downloadImage = () => {
    if (profileImage) saveAs(profileImage, "tpp.png"); // Put your image url here.
    toast.success("Image downloaded");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col dark:bg-gray-800">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className=" w-full flex justify-center items-center fade-in-down-delay-2 mt-3">
        <div className="absolute hidden top-1 right-5 sm:block">
          <ThemeSwitch />
        </div>
        <Image src={Logo} width="60" height="60" alt="Tpp Downloader Logo" />
        <div className="text-xl font-extrabold uppercase  text-gray-800">
          <span className="text-[#4B9EFF]">Downloader</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-row justify-center items-center flex-wrap gap-x-7">
        <div className="max-w-[25rem] min-w-56 flex flex-col items-center">
          <h1 className="font-extrabold text-3xl text-gray-800 text-center mb-6 fade-in-down dark:text-white">
            <span className="text-[#21B36C]">Trovo</span> Profile Picture{" "}
            <span className="text-[#4B9EFF]">Downloader</span>
          </h1>
          <div className="fade-in-down-delay-1 w-3/4 sm:w-full space-y-2">
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Enter trovo profile URL
            </label>
            <div className="relative">
              <input
                onChange={handleInputChange}
                type="search"
                id="search"
                className="block p-4 pl-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-lg dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:ring-[#21B36C] focus:border focus:border-[#21B36C] outline-none "
                placeholder="Ex: https://trovo.live/s/username"
              />
              {loading ? (
                <button className="text-white absolute animate-pulse right-2.5 bottom-2.5 bg-[#21B36C] hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-[#28b47063] font-medium rounded-md text-sm px-4 py-2">
                  Loading...
                </button>
              ) : (
                <button
                  disabled={!profileUrl}
                  onClick={() => handleSubmitPorfile()}
                  className={
                    "text-white absolute right-2.5 bottom-2.5 bg-[#21B36C] hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-[#28b47063] font-medium rounded-md text-sm px-4 py-2" +
                    (profileUrl ? "" : " opacity-50 hover:shadow-none")
                  }
                >
                  View
                </button>
              )}
            </div>
          </div>
        </div>
        {profileImage && (
          <div className="fade-in-left max-w-[20rem] flex flex-col items-center">
            <div className="w-52 h-52 sm:w-72 sm:h-72 p-3 relative bg-white shadow-lg rounded-lg mb-5 dark:bg-gray-700">
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <Image
                  src={profileImage}
                  layout="fill"
                  alt="User profile picture"
                />
              </div>
            </div>
            <button
              onClick={() => downloadImage()}
              className="bg-[#4B9EFF] w-52 sm:w-56 py-3 rounded-lg flex flex-row items-center justify-center text-white font-bold transition-all 1s ease-in hover:shadow-lg"
            >
              Download
              <div className="ml-3">
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.2301 4.79052V0.781505C9.2301 0.355229 9.5701 0 10.0001 0C10.3851 0 10.7113 0.298491 10.763 0.67658L10.7701 0.781505V4.79052L15.55 4.79083C17.93 4.79083 19.8853 6.73978 19.9951 9.17041L20 9.38609V14.4254C20 16.873 18.1127 18.8822 15.768 18.995L15.56 19H4.44C2.06 19 0.11409 17.0608 0.00483778 14.6213L0 14.4047V9.37576C0 6.9281 1.87791 4.90921 4.22199 4.79585L4.43 4.79083H9.23V11.1932L7.63 9.54099C7.33 9.23119 6.84 9.23119 6.54 9.54099C6.39 9.69588 6.32 9.90241 6.32 10.1089C6.32 10.2659 6.3648 10.4295 6.45952 10.5679L6.54 10.6666L9.45 13.6819C9.59 13.8368 9.79 13.9194 10 13.9194C10.1667 13.9194 10.3333 13.862 10.4653 13.7533L10.54 13.6819L13.45 10.6666C13.75 10.3568 13.75 9.85078 13.45 9.54099C13.1773 9.25936 12.7475 9.23375 12.4462 9.46418L12.36 9.54099L10.77 11.1932V4.79083L9.2301 4.79052Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
          </div>
        )}
      </main>

      <footer className="w-full flex justify-center items-center text-gray-700 dark:text-gray-300 flex-col fade-in-down-delay-2">
        <div className="sm:hidden">
          <ThemeSwitch />
        </div>

        <a
          href="https://github.com/ADEV-00"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by <span className="text-teal-500 font-bold">ADEV</span>
        </a>
        <div>Copyright © 2022 TPP Downloader</div>
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-gray-700 dark:text-white",
        }}
      />
    </div>
  );
};

export default Home;
