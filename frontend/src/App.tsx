import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Catalog from './Screens/Catalog';
import ProductPage from './Screens/ProductPage';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Cart from './Screens/Cart';
import OldCheckout from './Screens/OldCheckout';
import Checkout from './Screens/CheckoutScreen/Checkout';

function App() {
  return (
    <BrowserRouter>
      <nav>
      <Link to="/">Home</Link>
        <Link to="/signin">SignIn</Link>
        <Link to="/signup">SignUp</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/productpage">ProductPage</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/oldcheckout">OldCheckout</Link>
        <Link to="/checkout">Checkout</Link>
      </nav>
      <Routes>
      <Route path="/" element={<>HomePage</>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/oldcheckout" element={<OldCheckout />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
