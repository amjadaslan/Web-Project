import { BrowserRouter, Route, Link, Routes, Navigate, HashRouter } from 'react-router-dom';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import { useEffect, useState } from 'react';
import { LoadingPage } from './HomePage';
import { ProductDashboard } from './Screens/Backoffice/ProductDashboard/ProductDashboard';
import { Product } from './Models/Product';
import axios from 'axios';
import { fetchCart, fetchOrders, fetchProducts, fetchUserInfo } from './Loaders';
import { OrderDashboard } from './Screens/Backoffice/OrderDashboard/OrderDashboard';
import { Order } from './Models/Order';
import { Catalog } from './Screens/Catalog';
import { CartPage } from './Screens/CartPage/CartPage';
import { CartItem } from './Models/Cart';
import { Checkout } from './Screens/CheckoutScreen/Checkout';
import { ProductPage } from './Screens/ProductPage/ProductPage';
import { exampleProduct } from './debug';
import { UserInfo } from './Models/UserInfo';
import { EcommerceAppBar } from './Screens/components/EcommerceAppBar';

axios.defaults.withCredentials = true;

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setallOrders] = useState<Order[]>([]);
  const [cartItems, setAllCartItems] = useState<CartItem[]>([]);

  const [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const [appBarTitle, setAppBarTitle] = useState<string>("");

  useEffect(() => {
    //TODO: What to do if one of these fails??
    fetchUserInfo(setUserInfo).then(() => setIsLoading(false));
    fetchProducts(setAllProducts).then(() => {
      fetchCart(allProducts, setAllCartItems);
    });
    fetchOrders(setallOrders);
  }, []);

  return (
    <HashRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/signin"> SignIn </Link>
        <Link to="/signup"> SignUp </Link>
        <Link to="/catalog"> Catalog </Link>
        <Link to="/productdashboard"> ProductDashboard </Link>
        <Link to="/orderdashboard"> OrderDashboard </Link>
      </nav>
      {isLoading || appBarTitle == "" ? <></> : <EcommerceAppBar userInfo={userInfo} appBarTitle={appBarTitle} />}
      <Routes>
        <Route path="/" element={<LoadingPage isLoading={isLoading} setIsLoading={setIsLoading} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog setAppBarTitle={setAppBarTitle} allProducts={allProducts} />} />
        <Route path="/productpage/:productId" element={<ProductPage setAppBarTitle={setAppBarTitle} productsInCart={cartItems.map((cartItem) => cartItem.product)} />} />
        <Route path="/cart" element={<CartPage setAppBarTitle={setAppBarTitle} cartItems={cartItems} setAllCartItems={setAllCartItems} />} />
        <Route path="/checkout" element={<Checkout setAppBarTitle={setAppBarTitle} cartItems={cartItems} />} />
        <Route path="/productdashboard" element={<ProductDashboard setAppBarTitle={setAppBarTitle} allProducts={allProducts} setAllProducts={setAllProducts} />} />
        <Route path="/orderdashboard" element={<OrderDashboard setAppBarTitle={setAppBarTitle} allOrders={allOrders} setAllOrders={setallOrders} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
