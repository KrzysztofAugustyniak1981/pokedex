import {Routes, Route} from 'react-router-dom';
import Home from '../components/subpages/home/Home';
import Login from '../components/subpages/auth/Login';
import Register from '../components/subpages/auth/Register';
import PokemonDetails from "../components/subpages/pokemon/PokemonDetails";
import Favourites from "../components/subpages/favourites/Favourites";
import Arena from "../components/subpages/arena/Arena";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
            <Route path="/favorites" element={<Favourites />} />
            <Route path="/arena" element={<Arena />} />
        </Routes>
    );
};

export default AppRouter;