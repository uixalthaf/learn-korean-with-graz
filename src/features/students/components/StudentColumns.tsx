import { createColumnHelper, tableFeatures } from "@tanstack/react-table";
import type { Student } from "../api/students.api.types";

export const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Student>();

export const studentColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
]);
