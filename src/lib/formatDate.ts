import { formatRelative } from "date-fns";

export function formatDate(value: string) {
  return formatRelative(new Date(value), new Date());
}
