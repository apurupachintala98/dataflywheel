import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("pages/Home"));

import Spinner from "components/Spinner";

function ReactRoute() {
  return (
    <BrowserRouter>
      <Helmet defaultTitle="Elevance Data Intelligence Platform">
        <meta name="description" content="Elevance Data Intelligence Platform" />
      </Helmet>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default ReactRoute;
