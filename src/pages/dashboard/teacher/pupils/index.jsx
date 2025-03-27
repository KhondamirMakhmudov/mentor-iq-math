import Dashboard from "@/components/dashboard";
import { groupsPupil } from "@/dummy-data";
import DndList from "@/components/drag-and-drop";
import { DndContext, closestCenter } from "@dnd-kit/core";
import SelectBox from "@/components/select-box";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SearchInput from "@/components/search";
import CardIcon from "@/components/icons/card";
import ListIcon from "@/components/icons/list";
import Button from "@/components/button";
const Index = () => {
  const [tab, setTab] = useState("pupils");
  const [groups, setGroups] = useState(groupsPupil);
  const [search, setSearch] = useState("");
  const [classValue, setClassValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const classOptions = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "c", label: "C" },
  ];

  const statusOptions = [
    { value: "active", label: "Faol" },
    { value: "inactive", label: "Nofaol" },
  ];

  const handleGroupDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      setGroups(arrayMove(groups, oldIndex, newIndex));
    }
  };

  const handleTab = (tab) => {
    setTab(tab);
  };
  return (
    <Dashboard>
      <div className=" flex items-center justify-between py-[16px]">
        <div className=" flex items-center gap-x-[12px]">
          <SearchInput
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />

          <SelectBox
            label="Класс"
            options={classOptions}
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            className="w-40"
          />

          <SelectBox
            label="Статус"
            options={statusOptions}
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="flex items-center gap-x-[12px]">
          <div onClick={() => handleTab("card")} className={"cursor-pointer"}>
            <CardIcon color={tab === "card" ? "#007AFF" : "#59626B"} />
          </div>

          <div
            onClick={() => handleTab("list")}
            className={"cursor-pointer ml-[16px] mr-[40px]"}
          >
            <ListIcon color={tab === "list" ? "#007AFF" : "#59626B"} />
          </div>

          <Button>Добавить группу</Button>
        </div>
      </div>

      {tab === "card" && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleGroupDragEnd}
        >
          <SortableContext
            items={groups}
            strategy={verticalListSortingStrategy}
          >
            <div className="">
              <div className="flex gap-4 min-w-max items-start">
                {groups.map((group) => (
                  <DndList
                    key={group.id}
                    groupId={group.id}
                    title={group.title}
                    itemsData={group.items}
                  />
                ))}
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </Dashboard>
  );
};

export default Index;
