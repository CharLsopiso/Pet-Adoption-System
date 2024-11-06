"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UsersModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUsers = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getUsers",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setUsers(response.data.success);
      } else {
        setUsers([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDeactivateClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("operation", "deactivateAdopter");
      formData.append(
        "json",
        JSON.stringify({
          adopterId: selectedUser.adopter_id,
        })
      );

      const response = await axios.post(url, formData);
      console.log(response);

      if (response.data.success) {
        setIsSubmitting(false);
        alert("Adopter deactivated successfully");
        setIsDialogOpen(false);
        getUsers();
      } else {
        setIsSubmitting(false);
        alert("Failed to deactivate adopter.");
      }
    } catch (e) {
      setIsSubmitting(false);
      console.error(e);
    }
    setIsDialogOpen(false); // Close the dialog after deactivation
  };

  const renderStatus = (status) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Adopters</h2>
      </div>

      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">First name</th>
            <th className="th-show">Last name</th>
            <th className="th-hide">Avatar</th>
            <th className="th-hide">Email</th>
            <th className="th-hide">Address</th>
            <th className="th-show">Status</th>
            <th className="th-hide">Created at</th>
            <th className="th-show">Actions</th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.adopter_id}>
                <td className="td-show">{user.first_name}</td>
                <td className="td-show">{user.last_name}</td>
                <td className="td-hide">
                  <Image
                    src={`${
                      user?.avatar
                        ? `http://localhost/pet-adoption-api/avatar/${user.avatar}`
                        : "/images/blank_profile.webp"
                    }`}
                    alt="Avatar"
                    className="rounded"
                    width={72}
                    height={72}
                  />
                </td>
                <td className="td-hide">{user.email}</td>
                <td className="td-hide">{user.address}</td>
                <td className="td-show">{renderStatus(user.status)}</td>
                <td className="td-hide">{user.created_at}</td>

                <td className="td-show">
                  {user.status !== "Deactivate" ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeactivateClick(user)}
                      >
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-record">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Deactivation Confirmation Dialog */}
      {selectedUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to deactivate or block{" "}
              <strong>
                {selectedUser.first_name} {selectedUser.last_name}
              </strong>
              ? They won't be able to use the application anymore.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeactivateConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Deactivate"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersModule;
