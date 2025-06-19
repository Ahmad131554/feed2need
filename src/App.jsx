import { RouterProvider } from "react-router";
import router from "./routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: "14px",
            padding: "12px 16px",
          },
        }}
      />
    </>
  );
}

export default App;
