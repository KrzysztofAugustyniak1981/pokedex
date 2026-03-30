import {Routes, Route} from 'react-router-dom';
import Home from '../components/subpages/home/Home';
import Login from '../components/subpages/auth/Login';
import Register from '../components/subpages/auth/Register';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};

export default AppRouter;