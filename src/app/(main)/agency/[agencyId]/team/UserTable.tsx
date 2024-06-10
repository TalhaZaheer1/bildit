"use client"
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInterfaceForTable } from "@/lib/types";
import { useModal } from "@/providers/ModalProvider";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import React, { useState } from "react";

interface Props<TData, TValue> {
  modularComponent: React.ReactNode;
  filterValue: string;
  data: TData[];
  actionButtonText: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
}

export default function UserTable<TData, TValue>({
  data,
  columns,
  modularComponent,
  filterValue,
  actionButtonText,
}: Props<TData, TValue>) {
  const { setOpen } = useModal();
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex items-center py-4 gap-2">
          <Search />
          <Input
            placeholder="Search Name..."
            value={
              (table.getColumn(filterValue)?.getFilterValue() as string) || ""
            }
            onChange={(e) =>
              table.getColumn(filterValue)?.setFilterValue(e.target.value)
            }
            className="h-12"
          />
        </div>
        <Button
          className="flex gap-2"
          onClick={() =>
            setOpen(
              <CustomModal
                title="Add a team member"
                defaultOpen={false}
                subheading="Send an invitation"
              >
                {modularComponent}
              </CustomModal>
            )
          }
        >
          {actionButtonText}
        </Button>
      </div>
      <div className="border bg-background rounded-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>No data...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </>
  );
}
