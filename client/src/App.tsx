import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ListRoute, { route } from "./router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {ListRoute.map((value: route, index: number) => {
          return <Route path={value.path} element={<value.component />} key={index} />;
        })}
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </BrowserRouter>
  );
}

export default App;
