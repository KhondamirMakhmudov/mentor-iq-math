import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// import ThemeChanger from "../theme-switcher";
import useGetQuery from "@/hooks/api/useGetQuery";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import storage from "@/services/storage";
import { get, isEmpty } from "lodash";
import { useRouter } from "next/router";
import LanguageDropdown from "@/components/language";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { TelegramIcon } from "@/components/icons/social-media/telegram";
import { InstagramIcon } from "@/components/icons/social-media/instagram";
import PhoneIcon from "@/components/icons/social-media/phone";
import { useTheme } from "next-themes";

const MainContentHead = ({ toggleSidebar, title, handleTab, tab }) => {
  const { data: session } = useSession();
  // const [tab, setTab] = useState("active");
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { theme } = useTheme();
  const profileRef = useRef(null);
  const { t } = useTranslation();

  const [accessToken, setAccessToken] = useState("");
  const [showModal, setShowModal] = useState(false);

  // const handleTab = (tab) => {
  //   setTab(tab);
  // };
  // const {
  //   data: networkings,
  //   isLoadingNetworkings,
  //   isFetchingNetworkings,
  // } = useGetQuery({
  //   key: KEYS.networkings,
  //   url: URLS.networkings,
  // });

  const handleProfile = () => {
    setOpenProfile(!openProfile);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }

    if (openProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile]);

  // useEffect(() => {
  //   const storedData = localStorage.getItem("dataRegister");
  //   const hasModalBeenShown = localStorage.getItem("modalShown");

  //   if (storedData) {
  //     try {
  //       const parsedData = JSON.parse(storedData);

  //       setUserData(parsedData);

  //       const tokenFromDataRegister = get(parsedData, "data.access_token");
  //       if (tokenFromDataRegister) {
  //         setAccessToken(tokenFromDataRegister);
  //       }

  //       if (!hasModalBeenShown) {
  //         setShowModal(true);
  //         localStorage.setItem("modalShown", "true");
  //       }
  //     } catch (error) {
  //       console.error("Error parsing JSON from localStorage:", error);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (session?.accessToken) {
  //     setAccessToken(session.accessToken);
  //     localStorage.removeItem("dataRegister");
  //   }
  // }, [session]);

  const {
    data: studentProfile,
    isLoading,
    isFetching,
  } = useGetQuery({
    key: KEYS.studentProfile,
    url: URLS.studentProfile,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    enabled: !!accessToken,
  });

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "https://iq-math.uz",
    });

    localStorage.clear();
    sessionStorage.clear();
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsExiting(false);
    }, 300);
  };

  return (
    <div className="border-b">
      <div className={"flex justify-between px-[24px] pt-[24px] pb-[16px]"}>
        <div className={"flex items-center gap-x-[24px] flex-1"}>
          {/* <button onClick={toggleSidebar}>
          <Image
            src={"/icons/sidebar.svg"}
            alt={"sidebar"}
            width={24}
            height={24}
          />
        </button> */}

          <p className="text-[24px]  font-semibold text-black">{title}</p>

          {router.pathname === "/dashboard/student/my-study" && (
            <div className="flex bg-[#F2F2F7] p-[4px] max-w-[223px] w-full rounded-[8px]">
              <button
                onClick={() => {
                  handleTab("active");
                }}
                className={`py-[6px]  rounded-md text-[15px] font-medium   w-1/2 transition-all duration-300 capitalize ${
                  tab === "active"
                    ? "bg-white text-black shadow-md"
                    : "text-[#5A6A85] hover:bg-[#ECF2FF]"
                }`}
              >
                Активные
              </button>

              <button
                onClick={() => {
                  handleTab("frozen");
                }}
                className={`py-2 px-4 w-2/3 rounded-md transition-all duration-300 ${
                  tab === "frozen"
                    ? "bg-white text-black shadow-md"
                    : "text-[#5A6A85] hover:bg-[#ECF2FF]"
                }`}
              >
                Замароженные
              </button>
            </div>
          )}
        </div>

        <div className={"relative flex items-center gap-x-[16px]"}>
          {/* <div
            onClick={() => router.push("/dashboard/student/coins")}
            className="flex gap-x-[8px] items-center py-[7px] cursor-pointer px-[12px] border border-[#E9E9E9] rounded-[12px]"
          >
            <Image
              src={"/icons/coins-logo.svg"}
              alt="coins-logo"
              width={26}
              height={26}
            />

            <p className="text-[19px] font-medium">808 баллов</p>
          </div> */}

          <LanguageDropdown />

          <div className="scale-100 active:scale-110 transition-all duration-300 p-[6px] cursor-pointer">
            <Image
              src={"/icons/bell.svg"}
              alt="coins-logo"
              width={26}
              height={26}
            />
          </div>

          <button onClick={handleProfile}>
            <Image
              src={"/images/avatar.png"}
              alt={"user"}
              width={40}
              height={40}
            />
          </button>

          {/* <div className="hidden lg:flex items-center gap-x-[10px]">
          {isEmpty(get(networkings, "data", []))
            ? ""
            : get(networkings, "data", []).map((networking, index) => (
                <div key={get(networking, "id") || index}>
                  {get(networking, "name") === "telegram" ? (
                    <a href={get(networking, "link")} target="_blank">
                      <TelegramIcon className="text-black dark:text-white hover:text-[#5d87ff]" />
                    </a>
                  ) : get(networking, "name") === "instagram" ? (
                    <a href={get(networking, "link")} target="_blank">
                      <InstagramIcon className="text-black dark:text-white hover:text-[#5d87ff]" />
                    </a>
                  ) : (
                    <a href="tel: +998 78 888 08 00" className="text-sm">
                      {" "}
                      <PhoneIcon className="text-black dark:text-white hover:text-[#5d87ff]" />{" "}
                    </a>
                  )}
                </div>
              ))}
        </div> */}

          {/* <ThemeChanger /> */}

          {/* <button onClick={handleProfile}>
          <Image src={"/images/user.png"} alt={"user"} width={42} height={42} />
        </button> */}

          {/* {openProfile && (
          <div
            ref={profileRef}
            className="absolute bg-white dark:bg-[#26334A] border rounded-md  min-w-[300px] -bottom-[300px] shadow-lg -left-[130px] p-[30px] z-50"
          >
            <div className="flex gap-x-[12px]">
              <Image
                src={"/icons/user.svg"}
                alt={"user"}
                width={70}
                height={70}
              />

              <div className="space-y-[4px] text-black dark:text-white">
                <h4 className="">{get(studentProfile, "data.full_name")}</h4>
                <p className="text-sm">
                  {get(studentProfile, "data.class_name")}
                </p>
                <div className="flex gap-x-[4px]">
                  <Image
                    src={"/icons/mail.svg"}
                    alt={"mail"}
                    width={18}
                    height={18}
                  />
                  <p className="text-xs text-[#7C8FAC] dark:text-gray-200">
                    {get(studentProfile, "data.email")}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#EAEFF4] rounded-[4px] my-[15px]"></div>

            <button
              onClick={() => router.push("/student-profile")}
              className="flex gap-x-[12px] text-start cursor-pointer"
            >
              <div className="bg-[#ECF2FF] p-[12px] rounded-md inline-block">
                <Image
                  src={"/icons/user-settings.svg"}
                  alt={"user-settings"}
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-black dark:text-white font-semibold">
                  {t("myPage")}
                </p>
                <p className="text-[#7C8FAC] dark:text-gray-200 text-sm">
                  {t("settings")}
                </p>
              </div>
            </button>

            <div className="w-full h-[1px] bg-[#EAEFF4] rounded-[4px] my-[15px]"></div>

            <button
              onClick={handleLogoutClick}
              className=" py-[8px] w-full bg-[#FA896B] text-white rounded-md hover:bg-[#FA714B]  transform duration-200"
            >
              {t("logout")}
            </button>
          </div>
        )} */}
          {/* 
        {isModalOpen && (
          <>
            <div
              className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 ${
                isExiting ? "opacity-0" : "opacity-40"
              }`}
            ></div>
            <div
              className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-semibold mb-1">{t("exitWeb")}</h2>
                <p className="text-lg font-medium text-[#7C8FAC] mb-4">
                  {t("exitWebDesc")}
                </p>
                <div className="flex justify-end gap-x-[10px]">
                  <button
                    onClick={handleLogout}
                    className="bg-green-500  text-white py-2 px-4 rounded"
                  >
                    {t("yes")}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-black py-2 px-4 rounded"
                  >
                    {t("no")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default MainContentHead;
