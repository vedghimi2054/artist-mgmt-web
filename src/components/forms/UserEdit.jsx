import { useForm } from "react-hook-form";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "../../utils/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { formatToDbDateTime } from "../../utils/dataTime";

export default function UserForm({ user, open, setOpen }) {
  const [errorMessage, setErrorMessage] = useState("");
  const formattedDob = formatToDbDateTime(user?.dob);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "",
      phone: user?.phone || "",
      dob: formattedDob || "",
      gender: user?.gender || "",
      address: user?.address || "",
    },
  });

  const handleCancel = () => {
    reset(); // Reset form and clear validation errors
    setOpen(false); // Close the modal
  };
  const onSubmit = async (data) => {
    console.log("id:",user.id)
    await axiosClient
      .put(`/user/${user.id}`, data)
      .then(() => {
        toast("User updated successfully");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err?.message)
        // setErrorMessage(err?.message);
      });
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="px-4 py-6 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Edit User
                  </h2>
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                      {errorMessage}
                    </div>
                  )}
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Phone number must be numeric",
                        },
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      {...register("dob", {
                        required: "Date of birth is required",
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-900 text-left"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      {...register("role", {
                        required: "Role is required",
                      })}
                      className="w-full mt-2 border rounded px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ARTIST_MANAGER">Artist Manager</option>
                      <option value="ARTIST">Artist</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.role.message}
                      </p>
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
