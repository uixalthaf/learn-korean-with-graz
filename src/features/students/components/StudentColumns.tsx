import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "../api/students.api.types";

export const studentColumns: ColumnDef<Student, unknown>[] = [
  {
    accessorKey: "name",
    header: "Student",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "enrolledCourses",
    header: "Enrolled Courses",
  },
  {
    accessorKey: "joinedAt",
    header: "Joined Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
