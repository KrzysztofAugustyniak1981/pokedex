import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  //przechodzenie między stronami
  <BrowserRouter>
    <ThemeProvider>
      //zalogowanie i rejestracja
      <AuthProvider>
        //wyświetlanie powiadomień
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);