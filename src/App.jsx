import AppRouter from "./routes/AppRouter";
import Navbar from "./components/shared/Navbar";

function App() {
  return (
    <>
    //nawigacja zawsze była widoczna
    <Navbar />
    <AppRouter />
    </>
  );
}

export default App;