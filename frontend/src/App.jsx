import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Singin } from "./pages/singin";
function App() {

  return (
  <BrowserRouter>
  <Routes>
    <Route path="/singin" element={<Singin/>}/>
    <Route path="/singup" element={<Singup/>}/>

    <Route path="/dashboard" element={<Dashboard/>}/>

    <Route path="/send" element={<SendMoney/>}/>


  </Routes>
  </BrowserRouter>
  )
}

export default App
