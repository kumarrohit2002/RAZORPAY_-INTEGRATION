import { BrowserRouter, Route, Routes } from "react-router-dom"
import Products from "./pages/Products"
import Failed from "./pages/Failed";
import Success from "./pages/Success";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products/>}/>
        <Route path="/success" element={<Success/>}/>
        <Route path="/failed" element={<Failed/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
