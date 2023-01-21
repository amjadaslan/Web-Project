import { BrowserRouter, Route, Link, Routes, Navigate } from 'react-router-dom';
import Catalog from './Screens/Catalog';
import ProductPage from './Screens/ProductPage';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Cart from './Screens/Cart';
import Checkout from './Screens/CheckoutScreen/Checkout';
import { useEffect, useState } from 'react';
import { LoadingPage } from './HomePage';
import BackOfficeProductsPage from './Screens/Backoffice/BackofficeProducts';
import { ProductDashboard } from './Screens/Backoffice/ProductDashboard/ProductDashboard';
import { Product } from './Models/Product';
import axios from 'axios';
import { fetchOrders, fetchProducts } from './Loaders';
import { OrderDashboard } from './Screens/Backoffice/OrderDashboard/OrderDashboard';
import { Order } from './Models/Order';

axios.defaults.withCredentials = true;

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setallOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchProducts(setAllProducts);
    fetchOrders(setallOrders);
  }, []);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/signin"> SignIn </Link>
        <Link to="/signup"> SignUp </Link>
        <Link to="/catalog"> Catalog </Link>
        <Link to="/productpage"> ProductPage </Link>
        <Link to="/cart"> Cart </Link>
        <Link to="/checkout"> Checkout </Link>
        <Link to="/backofficeproducts"> BackOfficeProducts </Link>
        <Link to="/productdashboard"> ProductDashboard </Link>
        <Link to="/orderdashboard"> OrderDashboard </Link>
      </nav>
      <Routes>
        <Route path="/" element={<LoadingPage isLoading={isLoading} setIsLoading={setIsLoading} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/backofficeproducts" element={<BackOfficeProductsPage />} />
        <Route path="/productdashboard" element={<ProductDashboard allProducts={allProducts} setAllProducts={setAllProducts} />} />
        <Route path="/orderdashboard" element={<OrderDashboard allOrders={allOrders} setAllOrders={setallOrders} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
