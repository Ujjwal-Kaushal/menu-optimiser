import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Gauge.css";
import Gauge from "./Gauge";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const Result = () => {
  const { isSignedIn } = useUser();
  const [catalogueResult, setCatalogueResult] = useState({});
  const [isResult, setIsResult] = useState(false);
  const getCatalogueDetails = async () => {
    const id = window.location.pathname.split("/result/")[1];
    const response = await axios.get(
      `http://localhost:3001/catalogue/vision/${id}`
    );
    console.log(response.data);
    setCatalogueResult(response.data);
    setIsResult(true);
  };

  useEffect(() => {
    getCatalogueDetails();
  }, []);
  return (
    isSignedIn && (
      <div>
        {/* <Navbar /> */}
        {isResult ? (
          <div>
            <main className="my-4 flex flex-col items-center h-full">
              <div className="bg-white text-black py-2 px-4 font-serif text-3xl z-10 relative top-3 rounded-lg">
                <h2>{`Result`}</h2>
              </div>
              <section className="bg-blue-500 text-white p-4 rounded-lg w-3/5 h-1/4 relative">
                <div className="flex flex-col items-center">
                  <div className=" bg-white text-black font-semibold font-sans mt-2 w-full px-4 py-2 rounded relative z-10 flex flex-row justify-between">
                    <div>
                      <p>{`1. Image1`}</p>
                    </div>
                    <div>
                      <p>{"Uploaded"}</p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="bg-white text-black py-2 px-4 font-serif text-3xl z-10 relative top-4 rounded-lg">
                <h3>{"Catalogue Score"}</h3>
              </div>
              <section
                className="bg-blue-500 px-6 py-4 border border-gray-300 rounded-lg relative flex flex-col items-center w-3/5
  font-sans"
              >
                <div className="w-full p-2 bg-white rounded-lg mt-5 mb-2">
                  <div className="p-4 mb-4">
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Product Descriptions: ${catalogueResult.catalogue.ProductDescriptions}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Pricing Information: ${catalogueResult.catalogue.PricingInformation}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Product Images: ${catalogueResult.catalogue.ProductImages}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Layout & Design: ${catalogueResult.catalogue.LayoutAndDesign}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Discounts & Promotions: ${catalogueResult.catalogue.DiscountsAndPromotions}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Brand Consistency: ${catalogueResult.catalogue.BrandConsistency}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Contact Information & Call to Action: ${catalogueResult.catalogue.ContactInformationAndCallToAction}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Typos And Grammar: ${catalogueResult.catalogue.TyposAndGrammar}%`}
                    </div>
                    <div htmlFor="catalogueName" className="block text-black">
                      {`Legal Compliance: ${catalogueResult.catalogue.LegalCompliance}%`}
                    </div>
                    <div className="font-semibold mt-3">{`Areas of imporvement`}</div>
                    <div className="border border-slate-600 rounded-lg p-2 shadow-lg">
                      {catalogueResult.catalogue.areaOfImprovement}
                    </div>
                    <div className="absolute top-28 right-40 w-48">
                      <div className="gauge">
                        <div className="gauge__body">
                          <Gauge
                            score={
                              catalogueResult.catalogue.score
                                ? catalogueResult.catalogue.score
                                : 0.75
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        ) : (
          <div className="h-[80vh] grid place-content-center text-5xl text-sky-500 font-bold">
            {`OOps, Catalogue Destails Not Found`}
          </div>
        )}
      </div>
    )
  );
};

export default Result;
