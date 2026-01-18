import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";

const Router = () => {
    return (
        <BrowserRouter>
            <Header title="Havelsan Suit Project Demo" />
            <Routes>
                <Route index element={ <Home /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;