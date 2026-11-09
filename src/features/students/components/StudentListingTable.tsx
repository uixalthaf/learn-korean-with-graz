"use client";

import { useTable } from "@tanstack/react-table";
import { studentColumns, features } from "./StudentColumns";
import type { Student } from "../api/students.api.types";
import { useState, useEffect } from "react";
import { getTutorDashboardData } from "@/features/dashboard/api/dashboard.api";

const StudentListingTable = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const table = useTable({
    features,
    data: studentsData,
    columns: studentColumns,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getTutorDashboardData();
        setStudentsData(response.students);
      } catch (error) {
        console.error("Error while fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  const rows = table.getRowModel().rows;

  return (
    <div className="mt-4 max-w-full overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-stone-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold">
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-stone-200">
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListingTable;
