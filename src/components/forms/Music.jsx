import { useForm } from "react-hook-form";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosClient from "../../utils/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function MusicForm({ music, open, setOpen }) {
  const [errorMessage, setErrorMessage] = useState("");
    const {artistId}= useParams()
  

  const { register, handleSubmit } = useForm({
    values: {
      artistId,
      title: music?.title || "",
      albumName: music?.albumName || "",
      genre: music?.genre || "",
    },
  });

  const onSubmit = (data) => {
    if (music) {
      axiosClient
        .put(`/music/artist/${artistId}/${music.id}`, data )
        .then((resp) => {
          toast("music edited successfully");
          setOpen(false);
        })
        .catch((err) => {
          // set error message here
          setErrorMessage(err?.response?.data?.message);
        });
      return;
    }

    axiosClient
      .post(`/music/artist/${artistId}`, data )
      .then((resp) => {
        toast("music created successfully");
        setOpen(false);
      })
      .catch((err) => {
        // set error message here
        setErrorMessage(err?.response?.data?.message);
      });
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      {music ? "Edit music" : "Create music"}
                    </h2>
                    {errorMessage && <div>{errorMessage}</div>}
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="title"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Title
                        </label>
                        <div className="mt-2">
                          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                            <input
                              id="title"
                              name="title"
                              type="text"
                              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                              {...register("title")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="album name"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Album Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="album name"
                            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
                            {...register("albumName")}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="genre"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Genre
                        </label>
                        <div className="mt-2">
                          <select
                            className="border-b-2 p-1"
                            {...register("genre")}
                          >
                            <option value="">Select</option>
                            <option value="MB">Mb</option>
                            <option value="COUNTRY">Country</option>
                            <option value="ROCK">Rock</option>
                            <option value="JAZZ">Jazz</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <input
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
