import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import catalogueLogo from "../assets/catalogue-logo.svg";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const [catalogues, setCatalogues] = useState([]);
  const BASE_API = import.meta.env.VITE_BASE_API;
  const hanldeCreateUser = async () => {
    try {
      const response = await axios.post(`${BASE_API}/user/create`, {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        authID: user.id,
        profileImage: user.imageUrl,
      });
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getAllCatalogues = async () => {
    try {
      const response = await axios.get(`${BASE_API}/catalogue/all/${user.id}`);
      console.log(response);
      setCatalogues(response.data.catalogues);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    hanldeCreateUser();
    getAllCatalogues();
  }, []);
  return (
    <div>
      <>
        <Navbar />
        <main className="my-4 flex flex-col items-center h-full">
          <div className="bg-white text-black py-2 px-4 text-3xl z-10 relative top-3 rounded-lg font-serif">
            <h2>User Information</h2>
          </div>
          <section className="bg-blue-500 text-black py-4 px-4 rounded-lg w-3/5 relative">
            <div className="flex flex-col items-center">
              <div className=" bg-white font-sans text-black font-semibold text-xl mt-3 w-full px-4 py-2 m-2 rounded-lg relative z-10 flex flex-col justify-between">
                <p>Name : {user.fullName}</p>
                <p className="mt-3">
                  Email Address : {user.primaryEmailAddress.emailAddress}
                </p>
                <img
                  src={user?.imageUrl}
                  className="w-16 h-16 mb-2 rounded-full absolute top-2 right-6"
                  alt="Profile Image"
                />
              </div>
            </div>
          </section>
          <div className="bg-white text-black py-2 px-4 text-3xl z-10 relative top-4 rounded-lg font-serif">
            <h3>History</h3>
          </div>
          <section className="bg-blue-500 px-6 py-4 border font-mono font-semibold border-gray-300 rounded-lg relative flex flex-col items-center w-3/5">
            {catalogues?.map((catalogue, index) => {
              return <ScanListItem key={index} catalogue={catalogue} />;
            })}
          </section>
        </main>
      </>
      )
    </div>
  );
};

const ScanListItem = ({ catalogue }) => {
  const navigate = useNavigate();
  const date = new Date(catalogue.createdOn);
  return (
    <button
      className="w-full bg-white rounded-lg mt-5 mb-2 flex flex-row justify-between"
      onClick={() => {
        navigate(`/result/${catalogue._id}`);
      }}
    >
      <div className="flex">
        <img
          src={catalogueLogo}
          className="w-10 h-10 m-2"
          alt="catalogue logo"
        />
        <div className="p-4">Scan 1: {catalogue.catalogue_name}</div>
      </div>
      <div className="p-4">Date: {date.toDateString()}</div>
    </button>
  );
};

export default Dashboard;
