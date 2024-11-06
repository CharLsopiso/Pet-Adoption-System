import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
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

const InterviewModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [list, setList] = useState([]);
  const [interviewList, setInterviewList] = useState([]);
  const [isSubmittingBtn, setSubmittingBtn] = useState(false);

  const FormSchema = z.object({
    adoptionDate: z.string().min(1, "Adoption date is required"),
    pickupDate: z.string().min(1, "Pick up date is required"),
  });

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      adoptionDate: "",
      pickupDate: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    try {
      const jsonData = {
        interviewId: list.interview_id,
        petId: list.pet_id,
        adopterId: list.adopter_id,
        adoptionDate: data.adoptionDate,
        pickupDate: data.pickupDate,
        petName: list.pet_name,
        firstName: list.first_name,
        lastName: list.last_name,
        email: list.email,
        requestId: list.adoption_request_id,
      };
      const formData = new FormData();
      formData.append("operation", "passedInterview");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      console.log(response);

      if (response.data.success) {
        alert(`${response.data.success}`);
        setIsModalOpen(false);
        getInterviewList();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleFailAndNoshow = async (operation) => {
    try {
      setSubmittingBtn(true);
      const jsonData = {
        interviewId: list.interview_id,
        petId: list.pet_id,
        petName: list.pet_name,
        firstName: list.first_name,
        lastName: list.last_name,
        email: list.email,
        requestId: list.adoption_request_id,
      };

      const formData = new FormData();
      formData.append("operation", operation);
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      console.log(response);

      if (response.data.success) {
        alert(`${response.data.success}`);
        setSubmittingBtn(false);
        setIsModalOpen(false);
        getInterviewList();
      } else {
        setSubmittingBtn(false);
        alert("Failed to submit");
      }
    } catch (error) {
        setSubmittingBtn(false);
      alert("Error: " + error.message);
    }
  };

  const getInterviewList = async () => {
    try {
      const formData = new FormData();
      formData.append("operation", "getInterviews");
      formData.append("json", "");
      const response = await axios.post(url, formData);

      if (response.status === 200 && response.data.success) {
        setInterviewList(response.data.success);
      } else {
        setInterviewList([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getInterviewList();
  }, []);

  const renderInterviewStatus = (status) => {
    if (status === "Passed") {
      return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {status}
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          {status}
        </span>
      );
    } else if (status === "No-show") {
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
    if (modalType === "passed") {
      return (
        <>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark interview as passed</DialogTitle>
              </DialogHeader>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Adoption date
                    </label>
                    <Input type="date" {...methods.register("adoptionDate")} />
                    {formState.errors.adoptionDate && (
                      <p className="text-red-500 text-xs">
                        {formState.errors.adoptionDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Pick up date
                    </label>
                    <Input type="date" {...methods.register("pickupDate")} />
                    {formState.errors.pickupDate && (
                      <p className="text-red-500 text-xs">
                        {formState.errors.pickupDate.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Save"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
        </>
      );
    } else if (modalType === "failed") {
      return (
        <>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Interview as Failed</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to mark this interview as failed? This
                action cannot be undone, and the applicant will be informed of
                the decision.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 text-white"
                  disabled={isSubmittingBtn}
                  onClick={() => handleFailAndNoshow("failedInterview")}
                >
                  {isSubmittingBtn ? "Submitting..." : "Fail"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    } else if (modalType === "noshow") {
      return (
        <>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Interview as no show</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to mark this interview as no show? This
                action cannot be undone, and the applicant will be informed of
                the decision.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 text-white"
                  disabled={isSubmittingBtn}
                  onClick={() => handleFailAndNoshow("noShowInterview")}
                >
                  {isSubmittingBtn ? "Submitting..." : "No show"}
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
        <h2 className="text-3xl font-bold tracking-tight">
          Scheduled interviews
        </h2>
      </div>

      <table className="cust-table">
      <thead className="cust-thead">
          <tr>
            <th className="th-show">Pet name</th>
            <th className="th-show">Adopter</th>
            <th className="th-hide">
              Date and time
            </th>
            <th className="th-show">Status</th>
            <th className="th-show">Actions</th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {interviewList.length > 0 ? (
            interviewList.map((list) => (
              <tr key={list.interview_id}>
                <td className="td-show">{list.pet_name}</td>
                <td className="td-show">
                  {list.first_name} {list.last_name}
                </td>
                <td className="td-hide">
                  {list.interview_datetime}
                </td>
                <td className="td-show">{renderInterviewStatus(list.status)}</td>
                <td className="td-show">
                {list.status === "Pending" ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleAction(list, "passed")}
                        className="mr-2"
                      >
                        <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleAction(list, "failed")}
                      >
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleAction(list, "noshow")}
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
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
              <td colSpan="5" className="no-record">No interviews available</td>
            </tr>
          )}
        </tbody>
      </table>

      {renderDialogContent()}
    </div>
  );
};

export default InterviewModule;
