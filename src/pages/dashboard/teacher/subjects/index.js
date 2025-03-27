import Dashboard from "@/components/dashboard";
import { useSession } from "next-auth/react";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { get } from "lodash";
import useGetQuery from "@/hooks/api/useGetQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { config } from "@/config";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import SimpleModal from "@/components/modal/simple-modal";

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [isExiting, setIsExiting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState(null);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const [showModal, setShowModal] = useState(!!phone);
  const [showNextModal, setShowNextModal] = useState(false);
  const [tab, setTab] = useState("first");

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
  } = useGetQuery({
    key: KEYS.studentProfile,
    url: URLS.studentProfile,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken, // Only fetch if accessToken is available
  });

  // Copy login/password to clipboard
  const handleCopy = () => {
    const textToCopy = `Login: ${session.login}\nPassword: ${session.password}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  // Close the modal
  const closeModal = () => {
    setTimeout(() => {
      setShowModal(false); // Close the modal
    }, 300);
  };

  useEffect(() => {
    if (!showModal && phone) {
      setTimeout(() => {
        setShowNextModal(true);
      }, 300); // Modal yopilgandan keyin biroz kutish uchun
    }
  }, [showModal]);
  const {
    data: studentSubjects,
    isLoading,
    isFetching,
  } = useGetQuery({
    key: KEYS.studentSubjects,
    url: URLS.studentSubjects,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken,
  });
  return (
    <Dashboard headerTitle={"Предметы"}>
      {showModal && phone && (
        <SimpleModal>
          <div className="flex justify-between px-[16px] py-[18px]">
            <h3 className="text-[19px] font-semibold">
              {" "}
              {t("confidentiality")}
            </h3>
            <button onClick={closeModal} className="rounded">
              <Image
                src={"/icons/close.svg"}
                alt="circle"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>
          <div className="px-[16px] py-[24px]">
            <div className="flex items-center gap-x-[5px]">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 text-[#13DEB9]"></h2>
            </div>
            <h2 className="lg:text-lg md:text-base text-sm font-semibold mb-1">
              {t("userLoginandPassword")}
            </h2>
            <p className="md:text-base lg:text-lg text-sm  font-medium text-[#7C8FAC] mb-2">
              {t("yourLogin")}: {session?.login}
            </p>
            <p className="md:text-base lg:text-lg text-sm  font-medium text-[#7C8FAC] mb-4">
              {t("yourPassword")}: {session?.password}
            </p>
            <p className="text-xs sm:text-sm font-medium text-[#7C8FAC]">
              {t("WantchangePassword")}
            </p>
          </div>
          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

          <div className="flex flex-col sm:flex-row justify-center gap-y-2 sm:gap-y-0 gap-x-2 py-[18px]">
            <button
              onClick={handleCopy}
              className="bg-[#5D87FF] text-white py-2 px-4 rounded w-full sm:w-auto"
            >
              {copied ? `${t("copied")}` : `${t("copy")}`}
            </button>
          </div>
        </SimpleModal>
      )}
      <Swiper
        spaceBetween={24}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        loop={true}
        className="present-swiper"
      >
        {get(studentSubjects, "data", []).map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="space-y-[12px] w-[95px] cursor-pointer group"
              onClick={() =>
                router.push(`/dashboard/student/subjects/${get(item, "id")}`)
              }
            >
              <div className="rounded-[12px]">
                <Image
                  src={`${config.API_URL}${get(item, "image")}`}
                  alt="math"
                  width={95}
                  height={124}
                  className="rouned-[12px] shadow-md"
                />
              </div>

              <p className="text-[15px] font-medium text-center group-hover:text-[#007AFF] transition-all duration-300">
                {get(item, "name")}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showNextModal && (
        <SimpleModal>
          <div className="flex justify-between px-[16px] py-[18px]">
            <h3 className="text-[19px] font-semibold">Диагностика</h3>
            <button onClick={() => setShowNextModal(false)} className="rounded">
              <Image
                src="/icons/close.svg"
                alt="close"
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>
          <div className="p-[24px]">
            <p className="text-[15px]">Выберите свой уровень</p>
            <ul className="flex mt-[16px] gap-x-[12px]">
              <li className="flex-grow">
                <button
                  onClick={() => handleTabChange("first")}
                  className={`border  ${
                    tab === "first" ? "border-[#5D87FF]" : "border-[#E9E9E9]"
                  } rounded-[12px] px-[16px] w-full block py-[12px] translation-all duration-300`}
                >
                  1 уровень
                </button>
              </li>
              <li className="flex-grow">
                <button
                  onClick={() => handleTabChange("second")}
                  className={`border  ${
                    tab === "second" ? "border-[#5D87FF]" : "border-[#E9E9E9]"
                  } rounded-[12px] px-[16px] w-full block py-[12px] translation-all duration-300`}
                >
                  2 уровень
                </button>
              </li>
              <li className="flex-grow">
                <button
                  onClick={() => handleTabChange("third")}
                  className={`border  ${
                    tab === "third" ? "border-[#5D87FF]" : "border-[#E9E9E9]"
                  } rounded-[12px] px-[16px] w-full block py-[12px] translation-all duration-300`}
                >
                  3 уровень
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

          <div className="flex flex-col sm:flex-row justify-center gap-y-2 sm:gap-y-0 gap-x-2 py-[18px]">
            <button
              onClick={() =>
                router.push(`/dashboard/student/individual/undefined/1`)
              }
              className="bg-[#5D87FF] text-white py-[11px] px-[26px] rounded-[8px] w-full sm:w-auto"
            >
              Пройти тест
            </button>
          </div>
        </SimpleModal>
      )}
    </Dashboard>
  );
};

export default Index;
