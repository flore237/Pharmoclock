import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import AddStaff from "./pages/AddStaff";
import CreateReport from "./pages/CreateReport";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PersonnelDetails, {
  PersonnelDetailsLoader,
} from "./pages/PersonnelDetails";
import PersonnelList from "./pages/PersonnelList";
import Reports from "./pages/Reports";
import Signin from "./pages/Signin";
import MissedReports from "./pages/MissedReports";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="addstaff" element={<AddStaff />} />
        <Route path="personnel">
          <Route index element={<PersonnelList />} />
          <Route
            path=":id"
            element={<PersonnelDetails />}
            loader={PersonnelDetailsLoader}
          />
        </Route>
        <Route path="createreport" element={<CreateReport />} />
        <Route path="reports" element={<Reports />} />
        <Route path="missedreport" element={<MissedReports />} />
      </Route>

      <Route path="signin" element={<Signin />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
