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

        <div className="mt-[24px] flex gap-x-[24px]">
          {get(subjects, "data", []).map((item, index) => (
            <div
              key={index}
              className="space-y-[12px] w-[95px] cursor-pointer group flex flex-col"
              onClick={() =>
                router.push(`/dashboard/teacher/subjects/${get(item, "id")}`)
              }
            >
              <div className="rounded-[12px] flex-grow">
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

              <p className="text-sm text-center group-hover:text-[#007AFF]">
                {get(item, "class_name")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
