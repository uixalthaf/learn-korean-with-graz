"use client";

import { flexRender, useTable } from "@tanstack/react-table";
import { studentColumns } from "./StudentColumns";
import type { Student } from "../api/students.api.types";
import { useState, useEffect } from "react";
import { getTutorDashboardData } from "@/features/dashboard/api/dashboard.api";

const StudentListingTable = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const table = useTable({
    data: studentsData,
    columns: studentColumns,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getTutorDashboardData();
        console.log(studentsData);
        setStudentsData(response.students);
      } catch (error) {
        console.log("error while feching student data", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 mt-4">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-stone-200">
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={studentColumns.length} className="px-4 py-8 text-center text-stone-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListingTable;
