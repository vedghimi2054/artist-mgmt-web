import { useForm } from "react-hook-form";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "../../utils/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { formatToDbDateTime } from "../../utils/dataTime";

export default function ArtistForm({ artist, open, setOpen }) {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      name: artist?.name || "",
      dob: artist?.dob || "",
      gender: artist?.gender || "",
      address: artist?.address || "",
      firstReleaseYear: artist?.firstReleaseYear || "",
      noOfAlbumsReleased: artist?.noOfAlbumsReleased || "",
    },
  });

  const handleCancel = () => {
    reset(); // Reset form and clear validation errors
    setOpen(false); // Close the modal
  };

  const onSubmit = (data) => {
    if (artist) {
      axiosClient
        .put(`/artists/${artist.id}`, {
          ...data,
          dob: formatToDbDateTime(data.dob),
        })
        .then(() => {
          toast.success("Artist edited successfully");
          setOpen(false);
        })
        .catch((err) => {
          setErrorMessage(err?.response?.data?.message || "An error occurred");
        });
      return;
    }

    axiosClient
      .post("/artists", {
        ...data,
        dob: formatToDbDateTime(data.dob),
      })
      .then(() => {
        toast.success("Artist created successfully");
        setOpen(false);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message || "An error occurred");
      });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="px-4 py-6 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {artist ? "Edit Artist" : "Create Artist"}
                  </h2>
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
                  )}

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 text-left">
                      Name
                    </label>
                    <input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-900 text-left">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      {...register("dob", { required: "Date of Birth is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-900 text-left">
                      Gender
                    </label>
                    <select
                      {...register("gender", { required: "Gender is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-900 text-left">
                      Address
                    </label>
                    <input
                      {...register("address", { required: "Address is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                  </div>

                  {/* First Release Year */}
                  <div>
                    <label htmlFor="firstReleaseYear" className="block text-sm font-medium text-gray-900 text-left">
                      First Release Year
                    </label>
                    <input
                      type="number"
                      {...register("firstReleaseYear", { required: "First Release Year is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.firstReleaseYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstReleaseYear.message}</p>
                    )}
                  </div>

                  {/* No. of Albums Released */}
                  <div>
                    <label htmlFor="noOfAlbumsReleased" className="block text-sm font-medium text-gray-900 text-left">
                      No. of Albums Released
                    </label>
                    <input
                      type="number"
                      {...register("noOfAlbumsReleased", {
                        required: "Number of Albums Released is required",
                      })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.noOfAlbumsReleased && (
                      <p className="mt-1 text-sm text-red-600">{errors.noOfAlbumsReleased.message}</p>
                    )}
                  </div>
                </div>

               <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
 