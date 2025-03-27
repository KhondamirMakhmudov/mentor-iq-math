import Dashboard from "@/components/dashboard";
import { groupsPupil } from "@/dummy-data";
import DndList from "@/components/drag-and-drop";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
const Index = () => {
  const [groups, setGroups] = useState(groupsPupil);

  const handleGroupDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      setGroups(arrayMove(groups, oldIndex, newIndex));
    }
  };
  return (
    <Dashboard>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleGroupDragEnd}
      >
        <SortableContext items={groups} strategy={verticalListSortingStrategy}>
          <div className="flex  gap-4 ">
            {groups.map((group) => (
              <DndList
                key={group.id}
                groupId={group.id}
                title={group.title}
                itemsData={group.items}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Dashboard>
  );
};

export default Index;
