import { useForm } from "react-hook-form";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "../../utils/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function MusicForm({ music, open, setOpen }) {
  const [errorMessage, setErrorMessage] = useState("");
  const { artistId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      artistId,
      title: music?.title || "",
      albumName: music?.albumName || "",
      genre: music?.genre || "",
    },
  });

  const handleCancel = () => {
    reset(); // Reset form and clear validation errors
    setOpen(false); // Close the modal
  };

  const onSubmit = (data) => {
    if (music) {
      axiosClient
        .put(`/music/artist/${artistId}/${music.id}`, data)
        .then(() => {
          toast("Music edited successfully");
          setOpen(false);
        })
        .catch((err) => {
          setErrorMessage(err?.response?.data?.message);
        });
      return;
    }

    axiosClient
      .post(`/music/artist/${artistId}`, data)
      .then(() => {
        toast("Music created successfully");
        setOpen(false);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message);
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
                    {music ? "Edit Music" : "Create Music"}
                  </h2>
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
                  )}

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 text-left">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register("title", { required: "Title is required" })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                  </div>

                  {/* Album Name */}
                  <div>
                    <label htmlFor="albumName" className="block text-sm font-medium text-gray-900 text-left">
                      Album Name
                    </label>
                    <input
                      id="albumName"
                      type="text"
                      {...register("albumName", {
                        required: "Album name is required",
                      })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    {errors.albumName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.albumName.message}
                      </p>
                    )}
                  </div>

                  {/* Genre */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-900 text-left">
                      Genre
                    </label>
                    <select
                      id="genre"
                      {...register("genre", {
                        required: "Genre is required",
                      })}
                      className="w-full mt-1 border rounded px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="MB">Mb</option>
                      <option value="COUNTRY">Country</option>
                      <option value="ROCK">Rock</option>
                      <option value="JAZZ">Jazz</option>
                    </select>
                    {errors.genre && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.genre.message}
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
