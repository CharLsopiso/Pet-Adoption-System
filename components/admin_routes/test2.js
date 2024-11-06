import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/solid";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ApprovalModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [list, setList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);
  const [isSubmittingForReject, setSubmittingForReject] = useState(false);

  const FormSchema = z.object({
    intSchedule: z.string().min(1, "Interview schedule is required"),
  });

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      intSchedule: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    try {

      const jsonData = {
        interviewDatetime: modalType === "approve" ? data.intSchedule : null,
        petName: list.pet_name,
        firstName: list.first_name,
        lastName: list.last_name,
        email: list.email,
        petId: list.pet_id,
        requestId: list.adoption_request_id
      }
      const formData = new FormData();
      formData.append("operation", "adoptionApproval");
      formData.append("json",JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      if (response.data.success) {
        alert("Adoption request approved successfully.");
        setIsModalOpen(false);
        getApprovalList();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleReject = async () => {
    try {
      setSubmittingForReject(true);
      const jsonData = {
        petName: list.pet_name,
        firstName: list.first_name,
        lastName: list.last_name,
        email: list.email,
        petId: list.pet_id,
        requestId: list.adoption_request_id
      };
  
      const formData = new FormData();
      formData.append("operation", "adoptionRejected");
      formData.append("json", JSON.stringify(jsonData));
  
      const response = await axios.post(url, formData);
      if (response.data.success) {
        alert("Adoption request rejected successfully");
        setSubmittingForReject(false);
        setIsModalOpen(false);
        getApprovalList();
      } else {
        setSubmittingForReject(false);
        alert("Failed to submit");
      }
    } catch (error) {
      setSubmittingForReject(false);
      alert("Error: " + error.message);
    }
  };

  const getApprovalList = async () => {
    try {
      const formData = new FormData();
      formData.append("operation", "getAdoptionRequests");
      formData.append("json", "");
      const response = await axios.post(url, formData);

      if (response.status === 200 && response.data.success) {
        setApprovalList(response.data.success);
      } else {
        setApprovalList([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  const renderApprovalStatus = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          Accepted
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          {status}
        </span>
      );
    } else if (status === "Cancelled") {
      return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
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

  const handleAction = (list, type) => {
    
    setList(list);
    setModalType(type);
    setIsModalOpen(true);
  };

  const renderDialogContent = () => {
    if (modalType === "approve") {
      return (
        <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Interview Date and Time</label>
                <Input
                  type="datetime-local"
                  {...methods.register("intSchedule")}
                />
                {formState.errors.intSchedule && (
                  <p className="text-red-500 text-xs">
                    {formState.errors.intSchedule.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Schedule"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
        </>
      );
    } else if (modalType === "reject") {
      return (
        <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to reject this adoption request?</p>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-500 text-white"
              disabled={isSubmittingForReject}
              onClick={handleReject}
            >
              {isSubmittingForReject ? "Submitting..." : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      );
    } else if (modalType === "view") {
      return (
        <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[98%] overflow-x-hidden">
        <DialogHeader>
            <DialogTitle>Adopter & Pet Info</DialogTitle>
          </DialogHeader>
          <div className="flex-1 sidebar">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="col-span-1">
              <h2 className="text-xl font-bold tracking-tight mb-4 text-center">Adopter</h2>
              <div className="flex flex-col gap-3 items-center">
              <div className="h-32 w-32">
                <img
                  src={`${
                    list?.avatar
                      ? `http://localhost/pet-adoption-api/avatar/${list.avatar}`
                      : "/images/blank_profile.webp"
                  }`}
                  alt="Adopter image"
                  className="object-cover h-full w-full rounded"
                />
              </div>
              <p className="text-3xl font-bold mb-4">
              {list.first_name} {list.last_name}
            </p>
              </div>
            <div className="flex flex-col gap-2 px-6">
            <p className="text-lg font-bold py-2 uppercase">Profile</p>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Email
              </p>
              <p className="text-xl">{list.email}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Contact number
              </p>
              <p className="text-xl">{list.contact_number}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Address
              </p>
              <p className="text-xl">{list.address}</p>
            </div>
            <p className="text-lg font-bold py-2 uppercase">Background</p>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Household size
              </p>
              <p className="text-xl">{list.household_size}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Home type
              </p>
              <p className="text-xl">{list.home_type}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Monthly salary
              </p>
              <p className="text-xl">₱ {list.salary}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                People living with
              </p>
              <p className="text-sm">{list.live_with}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Availability to take care of pet
              </p>
              <p className="text-sm">{list.availability_to_care}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Other pets
              </p>
              <p className="text-sm">{list.other_pets}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Pet experiences
              </p>
              <p className="text-sm">{list.pet_experiences}</p>
            </div>
            </div>
              </div>
              <div className="col-span-1">
              <h2 className="text-xl font-bold tracking-tight mb-4 text-center">Requested pet</h2>
              <div className="flex flex-col gap-3 items-center">
              <div className="h-32 w-32">
                <img
                  src={`${
                    list?.pet_image
                      ? `http://localhost/pet-adoption-api/upload/${list.pet_image}`
                      : "/images/logo.png"
                  }`}
                  alt="Pet image"
                  className="object-conver h-full w-full rounded"
                />
              </div>
              <p className="text-3xl font-bold mb-4">
              {list.pet_name}
            </p>
              </div>
            <div className="flex flex-col gap-2 px-6">
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Gender
              </p>
              <p className="text-xl">{list.gender}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Breed
              </p>
              <p className="text-xl">{list.breed_name}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Type
              </p>
              <p className="text-xl">{list.pet_type_name}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Age
              </p>
              <p className="text-xl">{list.age}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-muted-foreground">
                Adoption fee
              </p>
              <p className="text-xl">₱ {list.adoption_fee}</p>
            </div>
            </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
       
        </>
      );
    }
  };

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Adoption approval</h2>
      </div>

      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">Pet name</th>
            <th className="th-show">Adopter</th>
            <th className="th-hide">Request date</th>
            <th className="th-show">Status</th>
            <th className="th-hide">Approval date</th>
            <th className="th-show">Actions</th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {approvalList.length > 0 ? (
            approvalList.map((list) => (
              <tr key={list.adoption_request_id}>
                <td className="td-show">{list.pet_name}</td>
                <td className="td-show">
                  {list.first_name} {list.last_name}
                </td>
                <td className="td-hide">
                  {list.request_date}
                </td>
                <td className="td-show">{renderApprovalStatus(list.status)}</td>
                <td className="td-hide">
                  {list.approval_date ? list.approval_date : "None"}
                </td>
                <td className="td-show">
                  {list.status === "Pending" ? (
                    <>
                    <Button
                    variant="ghost"
                    onClick={() => handleAction(list, "approve")}
                    className="mr-2"
                  >
                    <HandThumbUpIcon className="h-5 w-5 text-blue-500" />
                  </Button>
                  <Button variant="ghost" onClick={() => handleAction(list, "reject")}>
                    <HandThumbDownIcon className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button variant="ghost" onClick={() => handleAction(list, "view")}>
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  </Button></>
                  ) : (
                    <>
                  <Button variant="ghost" onClick={() => handleAction(list, "view")}>
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                    </>
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-record">No requests available</td>
            </tr>
          )}
        </tbody>
      </table>

      {renderDialogContent()}
    </div>
  );
};

export default ApprovalModule;
