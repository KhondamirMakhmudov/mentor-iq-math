import MainIcon from "@/components/icons/main";
import OlimpiadaIcon from "@/components/icons/olimpiada";
import SidebarTitle from "@/components/title/sidebar-title";
import ResultsIcon from "@/components/icons/results";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import SubjectIcon from "@/components/icons/subjects";
import MyStudyIcon from "@/components/icons/my-study";
import IndividualIcon from "@/components/icons/individual";
import PupilProfileIcon from "@/components/icons/pupil";
import CoinsIcon from "@/components/icons/coins";
import ChatIcon from "@/components/icons/chat";
import WalletIcon from "@/components/icons/wallet";
import Image from "next/image";
import DiagnosticsIcon from "@/components/icons/diagnostics";
const DashboardNav = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState("main");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleTab = (tab) => {
    setTab(tab);
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "https://iq.iq-math.uz", // Redirect to iq-math.uz after sign out
    });

    localStorage.clear();
    sessionStorage.clear();
  };

  // Function to handle showing the modal
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsExiting(false);
    }, 300); // Delay for the animation to complete
  };

  return (
    <div>
      <div className="font-sf h-[calc(100vh-200px)]">
        <div className="">
          <SidebarTitle>Основное</SidebarTitle>
          <div className="  flex flex-col  justify-between">
            <ul className="my-[12px] space-y-[8px] px-[24px]">
              <li
                onClick={() => {
                  handleTab("main");
                  router.push("/dashboard/student/subjects");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[12px] items-center py-[8px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/subjects"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:hover:bg-[#252B48] dark:text-white"
                  }`}
                >
                  {router.pathname === "/dashboard/student/subjects" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <SubjectIcon />
                  )}
                  <p className="text-[15px]">Предметы</p>
                </div>
              </li>

              <li
                onClick={() => {
                  handleTab("my-study");
                  router.push("/dashboard/student/my-study");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[10px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/my-study"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/my-study" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <MyStudyIcon />
                  )}

                  <p className="text-[15px] font-medium">Мое обучение</p>
                </div>
              </li>

              <li
                onClick={() => {
                  handleTab("individual ");
                  router.push("/dashboard/student/individual");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[10px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/individual"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/individual" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <IndividualIcon />
                  )}

                  <p className="text-[15px]">Самостоятельные </p>
                </div>
              </li>
              <li
                onClick={() => {
                  handleTab("diagnostics");
                  router.push("/dashboard/student/diagnostics");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[10px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/diagnostics"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/diagnostics" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <DiagnosticsIcon />
                  )}

                  <p className="text-[15px]">Диагностика </p>
                </div>
              </li>
            </ul>
            {/* <button
              onClick={handleLogoutClick}
              className=" text-[#FA896B] py-[8px] px-[24px] w-full] bg-[#FA896B] text-white rounded-md hover:bg-[#FA714B]  transform duration-200"
            >
              {t("logout")}
            </button> */}
          </div>
        </div>

        <div className="border-t ">
          <SidebarTitle>Аккаунт</SidebarTitle>
          <div className="flex flex-col justify-between ">
            <ul className="mt-[12px] space-y-[8px] px-[24px] mb-[24px]">
              <li
                onClick={() => {
                  handleTab("profile");
                  router.push("/dashboard/student/profile");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[12px] items-center py-[8px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/profile"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:hover:bg-[#252B48] dark:text-white"
                  }`}
                >
                  {router.pathname === "/dashboard/student/profile" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <PupilProfileIcon />
                  )}

                  <p className="text-[15px]">Профиль</p>
                </div>
              </li>

              <li
                onClick={() => {
                  handleTab("chat");
                  router.push("/dashboard/student/chat");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[12px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/chat"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/chat" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <ChatIcon />
                  )}
                  <p className="text-[15px]">Чат </p>
                </div>
              </li>

              <li
                onClick={() => {
                  handleTab("coins");
                  router.push("/dashboard/student/coins");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[10px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/coins"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/coins" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <CoinsIcon />
                  )}
                  <p className="text-[15px] font-medium">Баллы</p>
                </div>
              </li>
              <li
                onClick={() => {
                  handleTab("wallet");
                  router.push("/dashboard/student/wallet");
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex gap-x-[10px] items-center py-[10px] px-[12px] rounded-[8px] active:scale-90 scale-100 transition-all duration-300 ${
                    router.pathname === "/dashboard/student/wallet"
                      ? "bg-[#5D87FF] text-white"
                      : "text-[#5A6A85] dark:bg-[#202936] hover:bg-[#ECF2FF] dark:text-white dark:hover:bg-[#252B48]"
                  }`}
                >
                  {router.pathname === "/dashboard/student/wallet" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="chevron-down"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <WalletIcon />
                  )}
                  <p className="text-[15px] font-medium">Кошелек</p>
                </div>
              </li>
            </ul>

            <div className="border-t px-[24px] py-[24px] !text-white">
              <div
                className=" p-[16px] rounded-[16px] bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url(/images/bg-img.png)` }}
              >
                <h3 className="text-[13px] font-medium">Тарифный план</h3>

                <p className="text-[24px] font-semibold my-[12px]">
                  145,000 сум
                </p>

                <p className="text-[15px] font-medium">
                  Следующая списания <br /> 21 марта
                </p>

                <button className="border border-[#D1D1D6] rounded-[8px] text-[15px] py-[9px] w-full mt-[24px]">
                  {" "}
                  Отменить
                </button>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className=" text-black py-[9px] mx-[24px]  text-[15px] bg-[#EDEDF2]  rounded-md  transform duration-200"
            >
              {t("logout")}
            </button>
          </div>
        </div>

        {isModalOpen &&
          createPortal(
            <>
              {/* Modal Backdrop */}
              <div
                className={`fixed inset-0 w-full h-full bg-black transition-opacity z-[60] duration-300 ${
                  isExiting ? "opacity-0" : "opacity-40"
                }`}
                onClick={closeModal}
              ></div>

              {/* Modal Container */}
              <div
                className={`fixed inset-0 flex items-center justify-center z-[60] transition-all duration-300 ${
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
                      className="bg-green-500 text-white py-2 px-4 rounded"
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
            </>,
            document.body // Ensure modal is outside Sidebar
          )}
      </div>
    </div>
  );
};

export default DashboardNav;
