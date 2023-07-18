import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import AddStaff, { UserLoader } from "./pages/AddStaff";
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
import EmployeeGroup from "./pages/EmployeeGroup";
import GroupDetails, {
  GroupDetailsLoader,} from "./pages/GroupDetails";
import ReportList from "./pages/ReportList";
import AffectedReports from "./pages/AffectedReports";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
          <Route path="addstaff">
          <Route index element={<AddStaff />} />
          <Route
            path=":id"
            element={<AddStaff />}
            loader={UserLoader}
          />
        </Route>
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
        <Route path="reportlist" element={<ReportList />} />
        <Route path="affectedreports" element={<AffectedReports />} />
        <Route path="missedreport" element={<MissedReports />} />
           <Route path="employeegroup">
          <Route index element={<EmployeeGroup />} />
          <Route
            path=":id"
            element={<GroupDetails />}
            loader={GroupDetailsLoader}
          />
        </Route>
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
