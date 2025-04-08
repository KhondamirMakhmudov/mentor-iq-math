import Dashboard from "@/components/dashboard";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetQuery from "@/hooks/api/useGetQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { get } from "lodash";
import Button from "@/components/button";
import { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/input";
import usePostQuery from "@/hooks/api/usePostQuery";
import { CKEditor } from "ckeditor4-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const { chapterId, topicId } = router.query;
  const [selectedId, setSelectedId] = useState(null);
  const [openTestModal, setOpenTestModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [choices, setChoices] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const [images, setImages] = useState({
    A: null,
    B: null,
    C: null,
    D: null,
  });

  const handleChange = (e) => {
    setQuestionType(e.target.value);
  };

  const handleImageChange = (e, letter) => {
    const file = e.target.files[0];
    console.log("FILE", file);
    if (file) {
      setImages((prev) => ({
        ...prev,
        [letter]: file,
      }));
    }
  };

  const {
    data: topics,
    isLoading: isLoadingTopics,
    isFetching: isFetchingTopics,
  } = useGetQuery({
    key: KEYS.topics,
    url: chapterId ? `${URLS.topics}${chapterId}/` : null,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!chapterId && !!session?.accessToken,
  });

  const {
    data: questionList,
    isLoading,
    isFetching,
  } = useGetQuery({
    key: KEYS.questionList,
    url: `${URLS.questionList}${topicId}/`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!topicId && !!session?.accessToken,
  });

  const filteredTopic = get(topics, "data", [])?.find(
    (topic) => topic.id === Number(topicId)
  );

  // Mavzu yaratish

  const { mutate: createQuestion } = usePostQuery({
    key: "create-question",
  });

  const onSubmitCreateQuestion = () => {
    const formData = new FormData();
    formData.append("topic", topicId);
    formData.append("question_text", questionText);
    formData.append("question_type", questionType);
    formData.append("correct_answer", correctAnswer);
    formData.append("level", questionLevel);
    formData.append("choices", JSON.stringify(choices));

    if (questionType === "image_choice") {
      Object.entries(images).forEach(([letter, file], index) => {
        if (file) {
          formData.append(`images[${index}].choice_letter`, letter);
          formData.append(`images[${index}].image`, file);
        }
      });
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    createQuestion(
      {
        url: URLS.createQuestion,
        attributes: formData,
        config: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      },
      {
        onSuccess: () => {
          setOpenTestModal(false); // Modalni yopish
          setQuestionText(""); // Inputlarni tozalash
          queryClient.invalidateQueries([KEYS.questionList]);
          toast.success("Mavzu muvaqqiyatli yaratildi");
        },
        onError: (error) => {
          toast.error(error.response?.data.error);
        },
      }
    );
  };
  return (
    <Dashboard headerTitle={"Предметная и тестовая часть"}>
      <div className="grid grid-cols-12 gap-x-[24px]">
        <div className="col-span-6 space-y-[12px] border border-[#E9E9E9] rounded-[12px]  py-[12px]">
          <h1 className="text-center">{get(filteredTopic, "name")}</h1>

          <div className="w-full bg-[#E9E9E9] h-[1px]"></div>

          <div className="flex justify-between py-[12px] px-[24px]">
            <div className="flex gap-x-[15px] items-center">
              <div className="w-[60px] h-[60px] bg-[#EDEDF2] flex items-center justify-center rounded-[8px]">
                <Image
                  src={"/icons/play.svg"}
                  alt="play"
                  width={24}
                  height={24}
                />
              </div>

              <div className="space-y-[4px]">
                <h3 className="text-[17px] font-medium">Видео объяснение</h3>
                <p className="text-[#8A8A8E]">
                  Посмотрите перед тем как начать
                </p>
              </div>
            </div>

            <div className="flex items-center gap-x-[8px]">
              <a href={`${get(filteredTopic, "video_url")}`} target="_blank">
                <Button
                  border={"border border-[#D1D1D6]"}
                  px="px-[16px]"
                  py="py-[11px]"
                  classname={"bg-white !text-black"}
                >
                  Смотреть
                </Button>
              </a>

              <Button
                onclick={() => setOpenTestModal(true)}
                px="px-[16px]"
                py="py-[11px]"
              >
                Создать тест
              </Button>
            </div>
          </div>

          <div className="w-full bg-[#E9E9E9] h-[1px]"></div>

          <div className="py-[12px] px-[24px]">
            {parse(get(filteredTopic, "content") || "")}
          </div>
        </div>

        <div className="col-span-6 space-y-[12px] border border-[#E9E9E9] rounded-[12px] ">
          <table className="w-full">
            <thead>
              <tr className="border-b border-b-[#E9E9E9]">
                <th className="p-[12px] pl-[24px] text-left">#</th>
                <th className="p-[12px] text-center w-2/4">Вопрос</th>
                <th className="p-[12px] text-center w-1/4">Правильный ответ</th>
                <th className="p-[12px] text-center w-1/4">Тип вопроса</th>
              </tr>
            </thead>
            <tbody>
              {get(questionList, "data", []).map((topic, index) => (
                <tr key={index} className=" ">
                  <td className="p-[12px] pl-[24px]">{index + 1}</td>
                  <td className="p-[12px] text-center">
                    {parse(get(topic, "question_text") || "")}
                  </td>
                  <td className="p-[12px] text-center">
                    {parse(get(topic, "correct_answer") || "")}
                  </td>
                  <td className="p-[12px] text-center">
                    {get(topic, "question_type")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openTestModal && (
        <AnimatePresence>
          <motion.div
            className={`fixed inset-0 right-0 flex items-center justify-end z-50 transition-all bg-black bg-opacity-70 duration-300 `}
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-bl-[16px]  rounded-tl-[16px] right-0 shadow-lg w-1/2 h-screen overflow-y-auto font-sf"
            >
              <div className="flex justify-between px-[16px] py-[18px]">
                <h3 className="text-[19px] font-semibold">Savol yaratish</h3>
                <button
                  onClick={() => setOpenTestModal(false)}
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

              <div className="space-y-[15px] my-[20px]">
                <div className="px-[16px] mt-[18px] mb-[9px]">
                  <label>Savol</label>

                  <CKEditor
                    initData={questionText}
                    onChange={(event) =>
                      setQuestionText(event.editor.getData())
                    }
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

                <div className="px-[16px] mt-[18px] mb-[9px]">
                  <label>To&apos;g&apos;ri javob</label>

                  <CKEditor
                    initData={correctAnswer}
                    onChange={(event) =>
                      setCorrectAnswer(event.editor.getData())
                    }
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

                <div className="flex gap-4 mb-[10px]">
                  <div className="px-[16px] w-full space-y-[9px] flex flex-col">
                    <label>Savol ko&apos;rinishi</label>
                    <select
                      value={questionType}
                      onChange={handleChange}
                      className="border border-[#E9E9E9] rounded-[8px] w-full py-[10px] px-[16px] "
                    >
                      <option value="" disabled>
                        Tipni tanlang
                      </option>
                      <option value="text">Matnli javob</option>
                      <option value="choice">Variant tanlash</option>
                      <option value="image_choice">Rasmli variant</option>
                    </select>
                  </div>

                  <div className="px-[16px] w-full space-y-[9px] flex flex-col">
                    <label className="block  font-medium">
                      Savol darajasi:
                    </label>
                    <select
                      value={questionLevel}
                      onChange={(e) => setQuestionLevel(e.target.value)}
                      className="border border-[#E9E9E9] rounded-[8px] w-full py-[10px] px-[16px] "
                    >
                      <option value="" disabled>
                        ----------
                      </option>
                      <option value="1">1 - Oson</option>
                      <option value="2">2 - O‘rtacha</option>
                      <option value="3">3 - Qiyin</option>
                    </select>
                  </div>
                </div>

                {questionType === "choice" && (
                  <div className="mt-4 px-[16px] space-y-2">
                    {["A", "B", "C", "D"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <span className="font-medium">{option}:</span>
                        <input
                          type="text"
                          value={choices[option]}
                          onChange={(e) => handleChoiceChange(e, option)}
                          className="border border-[#E9E9E9] rounded-[8px] py-[8px] px-[12px] w-full"
                          placeholder={`${option} javobini kiriting`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {questionType === "image_choice" && (
                  <div className="mt-4 px-[16px] space-y-2">
                    {["A", "B", "C", "D"].map((letter) => (
                      <div key={letter}>
                        <label>{letter} varianti:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, letter)}
                        />
                        {images[letter] && <span>{images[letter].name}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#E9E9E9] w-full h-[1px] p-0"></div>

              <div className="px-[16px] py-[12px] flex items-center justify-end">
                <Button onclick={onSubmitCreateQuestion} classname={"!py-2"}>
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
