import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{display: "flex", justifyContent: "space-between", padding: "20px"}}>

            {/*Logo*/}
            <Link to="/">Pokedex</Link>

            {/*Przyciski nawigacyjne*/}
            <div style={{display: "flex", gap: "10px"}}>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/favorites">Ulubione</Link>
                <Link to="/arena">Arena</Link>
                <Link to="/ranking">Ranking</Link>
            </div>
        </nav>
    );
};

export default Navbar;