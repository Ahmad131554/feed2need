import { Outlet } from "react-router";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
