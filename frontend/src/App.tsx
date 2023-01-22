import { BrowserRouter, Route, Link, Routes, Navigate } from 'react-router-dom';
import ProductPage from './Screens/ProductPage';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import { useEffect, useState } from 'react';
import { LoadingPage } from './HomePage';
import { ProductDashboard } from './Screens/Backoffice/ProductDashboard/ProductDashboard';
import { Product } from './Models/Product';
import axios from 'axios';
import { fetchCart, fetchOrders, fetchProducts } from './Loaders';
import { OrderDashboard } from './Screens/Backoffice/OrderDashboard/OrderDashboard';
import { Order } from './Models/Order';
import { Catalog } from './Screens/Catalog';
import { CartPage } from './Screens/CartPage/CartPage';
import { CartItem } from './Models/Cart';
import { Checkout } from './Screens/CheckoutScreen/Checkout';

axios.defaults.withCredentials = true;

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setallOrders] = useState<Order[]>([]);
  const [cartItems, setAllCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    //TODO: What to do if one of these fails??
    fetchProducts(setAllProducts);
    fetchOrders(setallOrders);
    fetchCart(setAllCartItems);
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
        <Link to="/productdashboard"> ProductDashboard </Link>
        <Link to="/orderdashboard"> OrderDashboard </Link>
      </nav>
      <Routes>
        <Route path="/" element={<LoadingPage isLoading={isLoading} setIsLoading={setIsLoading} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog allProducts={allProducts} />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage cartItems={cartItems} setAllCartItems={setAllCartItems} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems}/>} />
        <Route path="/productdashboard" element={<ProductDashboard allProducts={allProducts} setAllProducts={setAllProducts} />} />
        <Route path="/orderdashboard" element={<OrderDashboard allOrders={allOrders} setAllOrders={setallOrders} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
