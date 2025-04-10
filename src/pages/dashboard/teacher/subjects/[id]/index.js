import Dashboard from "@/components/dashboard";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetQuery from "@/hooks/api/useGetQuery";
import { useSession } from "next-auth/react";
import { get } from "lodash";
import Button from "@/components/button";
import usePostQuery from "@/hooks/api/usePostQuery";
import { useState, useEffect } from "react";
import SimpleModal from "@/components/modal/simple-modal";
import Image from "next/image";
import Input from "@/components/input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { CKEditor } from "ckeditor4-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import EditIcon from "@/components/icons/edit";
import TrashIcon from "@/components/icons/trash";
import usePutQuery from "@/hooks/api/usePutQuery";
import useDeleteQuery from "@/hooks/api/useDeleteQuery";
import { config } from "@/config";
import { set } from "react-hook-form";
import parse from "html-react-parser";
const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dataChapter, setDataChapter] = useState([]);
  const { data: session } = useSession();
  const [newChapter, setNewChapter] = useState("");
  const [modalTypeOfChapter, setModalTypeOfChapter] = useState("create");
  const [topicName, setTopicName] = useState("");
  const [modalTypeOfTopic, setModalTypeOfTopic] = useState("create");
  const [content, setContent] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [openChapterModal, setOpenChapterModal] = useState(false);
  const [openTopicsModal, setOpenTopicsModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: chapters,
    isLoading,
    isFetching,
  } = useGetQuery({
    key: KEYS.chapters,
    url: `${URLS.chapters}${id}/`,
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
    key: [KEYS.topics, selectedId],
    url: selectedId ? `${URLS.topics}${selectedId}/` : null,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!selectedId && !!session?.accessToken,
  });
  // Bob yaratish
  const { mutate: createChapter } = usePostQuery({
    key: "create-chapter",
  });

  useEffect(() => {
    const data = get(chapters, "data", []);
    if (get(chapters, "data", [])) {
      setDataChapter(get(chapters, "data", []));
    }
  }, [get(chapters, "data", [])]);

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
          setNewChapter("");
          toast.success("Bob muvaqqiyatli yaratildi");
          queryClient.invalidateQueries([KEYS.chapters]);
        },
        onError: (error) => {
          console.log("Full error response:");

          toast.error(error.response?.data.error);
        },
      }
    );
  };

  // Bob o'zgartirish

  const { mutate: updateChapter } = usePutQuery({
    listKeyId: "update-chapter",
  });

  const onSubmitUpdateChapter = () => {
    updateChapter(
      {
        url: `${URLS.updateChapter}${selectedId}/`,
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
          setNewChapter("");
          toast.success("Bob muvaqqiyatli yaratildi");
          queryClient.invalidateQueries([KEYS.chapters]);
        },
        onError: (error) => {
          console.log("Full error response:");
          toast.error(error.response?.data.error);
        },
      }
    );
  };

  // Bob o'chirish

  const { mutate: deleteChapter } = useDeleteQuery({
    listKeyId: "delete-chapter",
  });

  const onSubmitDeleteChapter = () => {
    deleteChapter(`${config.API_URL}${URLS.deleteChapter}${selectedId}/`);
    setOpenChapterModal(false);
  };

  // Mavzu yaratish

  const { mutate: createTopic } = usePostQuery({
    key: "create-topic",
  });

  const onSubmitCreateTopic = () => {
    createTopic(
      {
        url: URLS.createTopic,
        attributes: {
          chapter: selectedId,
          name: topicName,
          video_url: videoLink,
          content: content,
        },
        config: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      },
      {
        onSuccess: () => {
          setOpenTopicsModal(false); // Modalni yopish
          setTopicName(""); // Inputlarni tozalash
          setVideoLink("");
          setContent("");
          queryClient.invalidateQueries([KEYS.topics]); // Queryni yangilash
          toast.success("Mavzu muvaqqiyatli yaratildi");
        },
        onError: (error) => {
          toast.error(error.response?.data.error);
        },
      }
    );
  };

  // Mavzu o'zgartirish
  const { mutate: updateTopic } = usePutQuery({
    listKeyId: "update-topic",
  });

  const onSubmitUpdateTopic = () => {
    updateTopic(
      {
        url: `${URLS.updateTopic}${selectedTopic?.id}/`,
        attributes: {
          chapter: selectedId,
          name: topicName,
          video_url: videoLink,
          content: content,
        },
        config: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      },
      {
        onSuccess: () => {
          setOpenTopicsModal(false); // Modalni yopish
          setTopicName(""); // Inputlarni tozalash
          setVideoLink("");
          setContent("");
          queryClient.invalidateQueries([KEYS.topics]); // Queryni yangilash
          toast.success("Mavzu muvaqqiyatli yaratildi");
        },
        onError: (error) => {
          toast.error(error.response?.data.error);
        },
      }
    );
  };

  // Mavzu o'chirish
  const { mutate: deleteTopic } = useDeleteQuery({
    listKeyId: "delete-topic",
  });

  const onSubmitDeleteTopic = () => {
    deleteTopic(`${config.API_URL}${URLS.deleteChapter}${selectedId}/`);
    setOpenTopicsModal(false);
  };

  console.log(selectedTopic);

  return (
    <Dashboard headerTitle={"Математика"}>
      <div className="font-sf">
        <div className="flex justify-between mb-2">
          <h2 className="font-semibold text-[22px] mb-[18px]">Темы/разделы</h2>
          <Button onclick={() => setOpenChapterModal(true)}>
            Cоздать главу
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-[24px]">
          <div className="col-span-6 self-start border border-[#E9E9E9] rounded-[12px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-b-[#E9E9E9]">
                  <th className="p-[12px] pl-[24px] text-left">#</th>
                  <th className="p-[12px] text-left">Название</th>
                  <th className="p-[12px] text-right">Действие</th>
                </tr>
              </thead>
              <tbody>
                {get(chapters, "data", []).map((chapter, index) => (
                  <tr
                    key={index}
                    className="border-t border-t-[#E9E9E9] cursor-pointer"
                  >
                    <td className="p-[12px] pl-[24px]">{index + 1}</td>
                    <td
                      className="p-[12px]"
                      onClick={() => setSelectedId(get(chapter, "id"))}
                    >
                      {get(chapter, "name")}
                    </td>
                    <td className="p-[12px] text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          onclick={() => {
                            setOpenTopicsModal(true);
                            setModalTypeOfChapter("create");
                            setSelectedId(get(chapter, "id"));
                          }}
                          py="py-[8px] text-sm"
                        >
                          Создать тему
                        </Button>
                        <Button
                          onclick={() => {
                            setOpenChapterModal(true);
                            setSelectedId(get(chapter, "id"));
                            setModalTypeOfChapter("update");
                          }}
                          py="py-[8px] px-[8px] block text-sm bg-[#FF9500FF] border"
                        >
                          <EditIcon color="white" />
                        </Button>
                        <Button
                          onclick={() => {
                            setOpenChapterModal(true);
                            setSelectedId(get(chapter, "id"));
                            setModalTypeOfChapter("delete");
                          }}
                          classname="py-[8px] px-[8px] text-sm bg-[#FF3B30]"
                        >
                          <TrashIcon color="white" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedId && (
            <div className="col-span-6 self-start border border-[#E9E9E9] rounded-[12px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-b-[#E9E9E9]">
                    <th className="p-[12px] pl-[24px] text-left">#</th>
                    <th className="p-[12px] text-left">Название</th>
                    <th className="p-[12px] text-right">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {get(topics, "data", []).map((topic, index) => (
                    <tr key={index} className="border-t border-t-[#E9E9E9]">
                      <td className="p-[12px] pl-[24px]">{index + 1}</td>
                      <td className="p-[12px] w-1/2">{get(topic, "name")}</td>
                      <td className="p-[12px] text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            onclick={() => {
                              setOpenTopicsModal(true);
                              setSelectedTopic(topic);
                              setModalTypeOfTopic("update");
                            }}
                            py="py-[8px] px-[8px] block text-sm bg-[#FF9500FF] border"
                          >
                            <EditIcon color="white" />
                          </Button>
                          <Button
                            onclick={() => {
                              setOpenTopicsModal(true);
                              setModalTypeOfTopic("delete");
                            }}
                            classname="py-[8px] px-[8px] text-sm bg-[#FF3B30]"
                          >
                            <TrashIcon color="white" />
                          </Button>

                          <Link
                            href={`/dashboard/teacher/subjects/${id}/${selectedId}/${get(
                              topic,
                              "id"
                            )}`}
                          >
                            <Button py="py-[8px] text-sm">Перейти</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {openChapterModal && (
        <SimpleModal>
          <div className="flex justify-between px-[16px] py-[18px]">
            <h3 className="text-[19px] font-semibold">
              {modalTypeOfChapter === "create"
                ? "Bob yaratish"
                : modalTypeOfChapter === "update"
                ? "Bobni o'zgartirish"
                : "Bobni o'chirish"}
            </h3>
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

          {modalTypeOfChapter === "delete" ? (
            <div>
              <p className="px-[16px] py-[18px]">
                {" "}
                Belgilangan bobni o&apos;chirganingizdan so&apos;ng, uni tiklab
                bo&apos;lmaydi.
              </p>
            </div>
          ) : (
            <div className="px-[16px] py-[18px]">
              <label>Bob nomi</label>
              <Input
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                placeholder={"Bob nomini kiriting"}
              />
            </div>
          )}

          <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

          <div className="px-[16px] py-[12px] flex items-center justify-center">
            <Button
              onclick={
                modalTypeOfChapter === "create"
                  ? onSubmitCreateChapter
                  : modalTypeOfChapter === "update"
                  ? onSubmitUpdateChapter
                  : onSubmitDeleteChapter
              }
              classname={"!py-2"}
            >
              {modalTypeOfChapter === "delete" ? "O'chirish" : "Yakunlash"}
            </Button>
          </div>
        </SimpleModal>
      )}

      {openTopicsModal && (
        <AnimatePresence>
          <motion.div
            className={`fixed inset-0 right-0 flex items-center justify-end z-50 transition-all bg-black bg-opacity-70 duration-300 `}
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-bl-[16px]  rounded-tl-[16px] right-0 shadow-lg w-1/2 h-full font-sf"
            >
              <div className="flex justify-between px-[16px] py-[18px]">
                <h3 className="text-[19px] font-semibold">
                  {modalTypeOfTopic === "create"
                    ? "Mavzu yaratish"
                    : modalTypeOfTopic === "update"
                    ? "Mavzuni o'zgartirish"
                    : "Mavzuni o'chirish"}
                </h3>
                <button
                  onClick={() => setOpenTopicsModal(false)}
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

              <div className="px-[16px] mt-[18px] mb-[9px]">
                <label>Mavzu nomi</label>
                <Input
                  value={
                    modalTypeOfTopic === "create"
                      ? topicName
                      : modalTypeOfTopic === "update"
                      ? selectedTopic?.name
                      : ""
                  }
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder={"Mavzu nomini kiriting"}
                />
              </div>

              <div className="px-[16px] mt-[18px] mb-[9px]">
                <label>Video link</label>
                <Input
                  value={
                    modalTypeOfTopic === "create"
                      ? videoLink
                      : modalTypeOfTopic === "update"
                      ? selectedTopic?.video_url
                      : ""
                  }
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder={"Video linkni nomini kiriting"}
                />
              </div>

              <div className="px-[16px]">
                <h3 className="text-[16px] font-normal mb-[10px]">
                  Mavzu kontenti
                </h3>
                <CKEditor
                  initData={
                    modalTypeOfTopic === "create"
                      ? content
                      : modalTypeOfTopic === "update"
                      ? parse(selectedTopic?.content)
                      : ""
                  }
                  onChange={(event) => setContent(event.editor.getData())}
                  config={{
                    toolbar: [
                      ["Bold", "Italic", "Strike"], // Text styling
                      [
                        "BulletedList",
                        "NumberedList",
                        "Outdent",
                        "Indent",
                        "Blockquote",
                      ], // Lists and indentation
                      ["Image", "Table", "SpecialChar"], // Media and special characters
                      ["Link", "Unlink"], // Links
                      ["Maximize", "Source"], // Fullscreen & Source mode
                      ["Undo", "Redo"], // Undo/Redo
                    ],
                  }}
                />
              </div>

              <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

              <div className="px-[16px] py-[12px] flex items-center justify-end">
                <Button
                  onclick={
                    modalTypeOfTopic === "create"
                      ? onSubmitCreateTopic
                      : modalTypeOfTopic === "update"
                      ? onSubmitUpdateTopic
                      : ""
                  }
                  classname={"!py-2"}
                >
                  Yakunlash
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </Dashboard>
  );
};

export default Index;
