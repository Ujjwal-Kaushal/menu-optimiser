import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import ScanResult from "../components/ScanResult";
import { TailSpin } from "react-loader-spinner";

const Welcome = () => {
  const { isSignedIn } = useUser();
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showResultSection, setShowResultSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [catalogueResult, setCatalogueResult] = useState({});
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const CLOUD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const { user } = useUser();
  const BASE_API = import.meta.env.VITE_BASE_API;

  const hanldeCreateUser = async () => {
    try {
      const response = await axios.post(`${BASE_API}/user/create`, {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        authID: user.id,
        profileImage: user.imageUrl,
      });
      // console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    hanldeCreateUser();
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData();
      formData.append("upload_preset", CLOUD_PRESET);
      formData.append("file", img);
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      const image_url = uploadRes.data.secure_url;
      const image_name = uploadRes.data.original_filename;

      // backend request.
      const res = await axios.post(`${BASE_API}/catalogue/add`, {
        userId: user.id,
        catalogue_name: name,
        catalogue_description: description,
        images: [{ image_name, image_url }],
      });

      // console.log(res);
      setCatalogueResult(res.data.catalogue);
      setIsLoading(false);
      setShowResultSection(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    isSignedIn && (
      <div>
        <Navbar />
        <div>
          <main className="my-4 flex flex-col items-center h-full">
            <div className="bg-white text-black font-serif py-2 px-4 text-3xl z-10 relative top-3 rounded-lg">
              <h2>Test Your Catalogue</h2>
            </div>
            <section className="bg-blue-500 text-white p-4 rounded-lg w-3/5 h-1/4 relative">
              <div className="flex flex-col items-center justify-center py-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                  }}
                />
              </div>
            </section>
            <div className="bg-white text-black font-serif py-2 px-4 text-3xl z-10 relative top-4 rounded-lg">
              <h3>Enter the Data</h3>
            </div>
            <section className="bg-blue-500 px-6 py-4 border border-gray-300 rounded-lg relative flex flex-col items-center w-3/5">
              <form
                onSubmit={handleSubmit}
                className="w-full p-2 bg-white rounded-lg mt-5 mb-2 font-sans"
              >
                <div className="p-4 mb-4">
                  <label
                    htmlFor="catalogueName"
                    className="block mt-2 text-black"
                  >
                    Name of the Catalogue:
                  </label>
                  <input
                    type="text"
                    id="catalogueName"
                    name="catalogueName"
                    className="border border-slate-700 rounded-md shadow-xl p-1 w-full"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <label
                    htmlFor="description"
                    className="block mt-2 text-black"
                  >
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    cols="50"
                    className="border border-slate-700 rounded-md shadow-xl p-1 w-full"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="w-full text-center">
                  <button
                    type="submit"
                    className="mt-3 text-xl bg-blue-500 text-white font-semibold px-5 py-2 rounded z-10 shadow-xl hover:shadow-none transition-shadow duration-300 ease-in-out"
                  >
                    {isLoading ? (
                      <TailSpin
                        visible={true}
                        height="30"
                        width="80"
                        color="#fff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    ) : (
                      "Scan"
                    )}
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
        {showResultSection && <ScanResult catalogue={catalogueResult} />}
      </div>
    )
  );
};

export default Welcome;
