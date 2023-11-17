/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginReg from "./components/LoginReg";
import AllReviews from "./components/AllReviews";
import ReviewDetail from "./components/ReviewDetail";
import UpdateReview from "./components/UpdateReview";
import ReviewForm from "./components/ReviewForm";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<LoginReg />} path="/" />
          <Route element={<AllReviews />} path="/reviews" /> 
          <Route element={<ReviewForm />} path="/reviews/new" />
          <Route element={<UpdateReview />} path="/reviews/:id/edit" />  
          <Route element={<ReviewDetail />} path="/reviews/:id" /> 
          <Route element={<LoginReg />} path="/login" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
