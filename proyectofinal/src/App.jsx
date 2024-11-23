import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductGallery from './pages/ProductGallery';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import AcercaDe from './pages/AcercaDe';
import Contacto from './pages/Contacto';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route 
                path="/admin" 
                element={<PrivateRoute element={<Admin />} adminOnly/>} 
            />
                        <Route path="/register" element={<Register />} />
                        <Route path="/gallery" element={<ProductGallery />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/acerca-de" element={<AcercaDe />} />
                        <Route path="/contacto" element={<Contacto />} />  
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;