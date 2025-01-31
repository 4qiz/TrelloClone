"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

import { useCardModal } from "@/hooks/use-card-modal";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  let variant = "default" as "destructive" | "default";
  if (data.deadlineDate) {
    const daysLeft = differenceInDays(data.deadlineDate, new Date());
    variant = daysLeft <= 1 ? "destructive" : "default";
  }
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
          {data.deadlineDate && (
            <div className="text-xs text-gray-500 mt-1 flex justify-end items-end">
              <Badge variant={variant}>
                {data.deadlineDate.toLocaleDateString()}
              </Badge>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
