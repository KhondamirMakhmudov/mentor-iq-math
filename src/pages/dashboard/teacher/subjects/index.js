import Dashboard from "@/components/dashboard";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetQuery from "@/hooks/api/useGetQuery";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { get } from "lodash";
import { config } from "@/config";
import Image from "next/image";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    isFetching: isFetchingSubjects,
  } = useGetQuery({
    key: KEYS.teacherSubjects,
    url: URLS.teacherSubjects,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken,
  });

  console.log(subjects);

  return (
    <Dashboard>
      <div>
        <div className="text-[22px] font-semibold">
          Предметы в вашей области
        </div>

        <div className="mt-[24px]">
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
            {get(subjects, "data", []).map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="space-y-[12px] w-[95px] cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/dashboard/teacher/subjects/${get(item, "id")}`
                    )
                  }
                >
                  <div className="rounded-[12px]">
                    <Image
                      src={`${config.API_URL}${get(item, "image")}`}
                      alt={`${get(item, "name")}`}
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
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
