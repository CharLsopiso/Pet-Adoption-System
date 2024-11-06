"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PetTypesModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("pet_type_name", {
        header: "Pet Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (props) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleEditType(props.row.original)}
              >
                Edit type
              </DropdownMenuItem>
              <DropdownMenuItem>Archive type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: types,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const getTypes = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getPetTypes",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setTypes(response.data.success);
      } else {
        setTypes([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleAddPetType = () => {
    reset({ petType: "" });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditType = (type) => {
    reset({ petType: type.pet_type_name });
    setSelectedEvent(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getTypes();
  }, []);

  const FormSchema = z.object({
    petType: z.string().min(1, "Pet type is required"),
  });

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      petType: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("operation", selectedEvent ? "updateType" : "addType");
    formData.append(
      "json",
      JSON.stringify({
        petTypeId: selectedEvent ? selectedEvent.pet_type_id : undefined,
        type: data.petType,
      })
    );

    try {
      const response = await axios.post(url, formData);
      if (response.data.success) {
        alert(`Type ${selectedEvent ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        getTypes();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pet types</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddPetType} variant="lime">
            <PlusIcon className="w-6 h-6 me-2" />
            <span>Add type</span>
          </Button>
        </div>
      </div>
      {/* Search filter input */}

      <Card>
        <CardHeader>
          <div className="w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search"
              value={globalFilter} // Bind to globalFilter state
              onChange={(e) => setGlobalFilter(e.target.value)} // Update filter value
              className="mb-4 p-2 border rounded"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table structure */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="2" className="text-center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="flex justify-between items-center">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="space-x-2">
              <Button
                variant="ghost"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>

              <Button
                variant="ghost"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit */}
      <Dialog  open={isModalOpen}
  onOpenChange={(open) => {
    if (!open) {
      // Ensure the modal is closed and any backdrop is removed
      setIsModalOpen(false);
    }
  }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Pet Type" : "Add Pet Type"}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="petType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet type" {...field} />
                    </FormControl>
                    {formState.errors.petType && (
                      <FormMessage>
                        {formState.errors.petType.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : selectedEvent
                    ? "Save Changes"
                    : "Add Type"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetTypesModule;

