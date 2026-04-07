import {Routes, Route} from 'react-router-dom';
import Home from '../components/subpages/home/Home';
import Login from '../components/subpages/auth/Login';
import Register from '../components/subpages/auth/Register';
import PokemonDetails from "../components/subpages/pokemon/PokemonDetails";
import Favourites from "../components/subpages/favourites/Favourites";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
            <Route path="/favorites" element={<Favourites />} />
        </Routes>
    );
};

export default AppRouter;