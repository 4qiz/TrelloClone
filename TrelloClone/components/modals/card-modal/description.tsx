"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardStatus } from "@prisma/client";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(true);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  //useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Задача "${data.title}" обновлена`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;

    const deadlineDateString = formData.get("deadlineDate") as string;
    const deadlineDate: Date | undefined = deadlineDateString
      ? new Date(deadlineDateString)
      : undefined;

    const status = formData.get("status") as CardStatus;

    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      boardId,
      deadlineDate,
      status,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Описание</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Описание задачи"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />

            {/* deadlineDate */}
            <p className="font-semibold text-neutral-700 mb-2">Крайний срок</p>
            <Input
              type="date"
              id="deadlineDate"
              name="deadlineDate"
              className="w-full"
              defaultValue={
                data.deadlineDate
                  ? new Date(data.deadlineDate).toISOString().split("T")[0]
                  : ""
              }
            />

            {/* status */}
            <p className="font-semibold text-neutral-700 mb-2">Статус</p>
            <Select defaultValue={data.status} name="status">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CardStatus.CANCELLED}>Отменена</SelectItem>
                <SelectItem value={CardStatus.TODO}>В процессе</SelectItem>
                <SelectItem value={CardStatus.COMPLETED}>Выполнена</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-x-2">
              <FormSubmit>Сохранить</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Отмена
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div
              onClick={enableEditing}
              role="button"
              className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md mb-2"
            >
              {data.description || "Описание задачи..."}
            </div>
            <p className="font-semibold text-neutral-700 mb-2">Крайний срок</p>
            <Input
              onClick={enableEditing}
              defaultValue={
                data.deadlineDate
                  ? new Date(data.deadlineDate).toISOString().split("T")[0]
                  : ""
              }
              className="mb-2"
            />

            <p className="font-semibold text-neutral-700 mb-2">Статус</p>
            <Select defaultValue={data.status} name="status">
              <SelectTrigger className="w-full" onClick={enableEditing}>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CardStatus.CANCELLED}>Отменена</SelectItem>
                <SelectItem value={CardStatus.TODO}>В процессе</SelectItem>
                <SelectItem value={CardStatus.COMPLETED}>Выполнена</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
