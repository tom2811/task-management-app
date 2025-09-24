import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TaskPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
