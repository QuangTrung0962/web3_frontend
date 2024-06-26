import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import Register from "./Auth/Register/Register";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/Detail/ProductDetail";
import SingleCategory from "./SingleCategory/SingleCategory";
import MobileNavigation from "./Navigation/MobileNavigation";
import DesktopNavigation from "./Navigation/DesktopNavigation";
import Wishlist from "./Pages/WhisList/Wishlist";
import PaymentSuccess from "./Pages/Payment/PaymentSuccess";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutForm from "./Components/Checkout/CheckoutForm";
import UpdateDetails from "./Pages/Update_User/UpdateDetails";

// import ForgotPasswordForm from "./Auth/ForgotPassword/ForgotPasswordForm";
// import AddNewPassword from "./Auth/ForgotPassword/AddNewPassword";
// import AdminLogin from "./Admin/Auth/Login/AdminLogin";
// import AdminRegister from "./Admin/Auth/Register/AdminRegister";
// import AdminHomePage from "./Admin/Pages/AdminHomePage";
// import SingleUserPage from "./Admin/Pages/SingleUserPage";
// import SingleProduct from "./Admin/Pages/SingleProduct";

import {
  ThirdwebProvider,
  metamaskWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";
import LoginWeb3 from "./Auth/Login/LoginWeb3";
import UserDetail from "./Pages/Update_User/UserDetail";

const activeChain = "sepolia";
function App() {
  return (
    <>
      <ThirdwebProvider
        autoConnect={false}
        activeChain={activeChain}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        supportedWallets={[
          metamaskWallet(),
          embeddedWallet({
            auth: {
              options: ["google", "facebook", "email"],
            },
          }),
        ]}
      >
        <ToastContainer
          toastClassName="toastContainerBox"
          transition={Flip}
          position="top-center"
        />
        <Router>
          <DesktopNavigation />
          <div className="margin">
            <Routes>
              {/*User Routes  */}
              <Route path="/" index element={<HomePage />} />
              <Route path="/login" element={<LoginWeb3 />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Detail/type/:cat/:id" element={<ProductDetail />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route
                path="product/type/:cat/:id"
                element={<SingleCategory />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/update" element={<UpdateDetails />} />
              <Route path="/user/detail" element={<UserDetail />} />
              <Route path="/paymentsuccess" element={<PaymentSuccess />} />
              {/* <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
              <Route
                path="/user/reset/:id/:token"
                element={<AddNewPassword />}
              /> */}

              {/* Admin Routes */}
              {/* <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/home" element={<AdminHomePage />} />
              <Route path="/admin/home/user/:id" element={<SingleUserPage />} />
              <Route
                path="/admin/home/product/:type/:id"
                element={<SingleProduct />}
              /> */}
            </Routes>
          </div>
          <MobileNavigation />
        </Router>
      </ThirdwebProvider>
    </>
  );
}
export default App;
