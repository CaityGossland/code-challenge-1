import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Places.css";

const PER_PAGE = 2;

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [currentPlaces, setCurrentPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Fetch all the places on initial page load
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places`
        );
        setPlaces(responseData.places);
        setPageCount(Math.ceil(responseData.places.length / PER_PAGE));
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  // Update currentPlaces as page changes
  useEffect(() => {
    setCurrentPlaces(places.slice(offset, offset + PER_PAGE));
  }, [currentPage, offset, places]);

  // Update pageCount if the number of places change
  useEffect(() => {
    const updatedPageCount = Math.ceil(places.length / PER_PAGE);
    setPageCount(updatedPageCount);
  }, [places]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
    setOffset(selectedPage * PER_PAGE);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && currentPlaces && (
        <>
          <PlaceList
            items={currentPlaces}
            onDeletePlace={placeDeletedHandler}
          />
          <ReactPaginate
            count={PER_PAGE}
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default Places;
