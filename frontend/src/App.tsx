import { BrowserRouter, Route, Link, Routes, Navigate, useNavigate } from 'react-router-dom';
import Catalog from './Screens/Catalog';
import ProductPage from './Screens/ProductPage';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Cart from './Screens/Cart';
import Checkout from './Screens/CheckoutScreen/Checkout';
import React, { useEffect, useState } from 'react';
import { LoadingPage } from './HomePage';



function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/signin">SignIn</Link>
        <Link to="/signup">SignUp</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/productpage">ProductPage</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LoadingPage isLoading={isLoading} setIsLoading={setIsLoading} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
