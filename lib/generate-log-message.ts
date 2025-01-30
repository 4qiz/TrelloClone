import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;
  const translateEntityType =
    entityType.toLowerCase() === "card"
      ? "задачу"
      : entityType.toLowerCase() === "board"
      ? "доску"
      : entityType.toLowerCase() === "list"
      ? "список"
      : "";
  switch (action) {
    case ACTION.CREATE:
      return `создал ${translateEntityType} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `обновил ${translateEntityType} "${entityTitle}"`;
    case ACTION.DELETE:
      return `удалил ${translateEntityType} "${entityTitle}"`;
    default:
      return `unknown action ${translateEntityType} "${entityTitle}"`;
  }
};
