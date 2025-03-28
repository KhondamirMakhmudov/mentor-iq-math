import Dashboard from "@/components/dashboard";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetQuery from "@/hooks/api/useGetQuery";
import { useSession } from "next-auth/react";
import { get } from "lodash";
import Button from "@/components/button";
import usePostQuery from "@/hooks/api/usePostQuery";
import { useState } from "react";
import SimpleModal from "@/components/modal/simple-modal";
import Image from "next/image";
import Input from "@/components/input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [newChapter, setNewChapter] = useState("");
  const [openChapterModal, setOpenChapterModal] = useState(false);
  const {
    data: chapters,
    isLoading,
    isFetching,
  } = useGetQuery({
    key: KEYS.chapters,
    url: URLS.chapters,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken,
  });

  const {
    data: topics,
    isLoading: isLoadingTopics,
    isFetching: isFetchingTopics,
  } = useGetQuery({
    key: KEYS.topics,
    url: URLS.topics,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken,
  });

  const { mutate: createChapter } = usePostQuery({
    key: "create-chapter",
  });

  const onSubmitCreateChapter = () => {
    createChapter(
      {
        url: URLS.createChapter,
        attributes: {
          subject: +id,
          name: newChapter,
        },
        config: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      },
      {
        onSuccess: () => {
          setOpenChapterModal(false);
          toast.success("Muvaqqiyatli yaratildi");
        },
        onError: (error) => {
          console.log("Full error response:");

          toast.error(error.response?.data.error);
        },
      }
    );
  };
  return (
    <Dashboard headerTitle={"Математика"}>
      <div className="font-sf">
        <div className="flex justify-between mb-2">
          <h2 className="font-semibold text-[22px] mb-[18px]">Темы/разделы</h2>
          <Button onclick={() => setOpenChapterModal(true)}>Создать</Button>
        </div>

        <div className="grid grid-cols-12 gap-[24px]">
          <div className="col-span-6 border border-[#E9E9E9] rounded-[12px]">
            <ul className="border rounded-md w-full">
              {get(chapters, "data", []).map((chapter, index) => (
                <li
                  key={index}
                  className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]"
                >
                  {index + 1}. {get(chapter, "name")}
                </li>
              ))}
              {/* <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9] bg-gray-100 ">
                I-глава. Натуральные числа и ноль
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                II-глава. Делимость натуральных чисел
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                III-глава. Дробные числа и действия над ними
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                IV-глава. Десятичные дроби. Применение операций с десятичными...
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                V-глава. Множество
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                VI-глава. Процент
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                VII-глава. Углы. Многоугольники
              </li>
              <li className="p-[12px] pl-[24px]">VIII-глава. Диаграмма</li> */}
            </ul>
          </div>

          <div className="col-span-6 border border-[#E9E9E9] rounded-[12px]">
            <ul>
              {get(topics, "data", []).map((chapter, index) => (
                <li
                  key={index}
                  className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]"
                >
                  <p>{get(chapter, "name")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {openChapterModal && (
        <SimpleModal>
          <div className="flex justify-between px-[16px] py-[18px]">
            <h3 className="text-[19px] font-semibold">Bob yaratish</h3>
            <button
              onClick={() => setOpenChapterModal(false)}
              className="rounded"
            >
              <Image
                src={"/icons/close.svg"}
                alt="circle"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

          <div className="px-[16px] py-[18px]">
            <label>Bob nomi</label>
            <Input
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              placeholder={"Bob nomini kiriting"}
            />
          </div>

          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

          <div className="px-[16px] py-[12px] flex items-center justify-center">
            <Button onclick={onSubmitCreateChapter} classname={"!py-2"}>
              Yakunlash
            </Button>
          </div>
        </SimpleModal>
      )}
    </Dashboard>
  );
};

export default Index;
