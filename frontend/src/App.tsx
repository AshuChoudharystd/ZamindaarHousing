import {Routes,Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Properties from "./components/Properties";
import SearchPage from "./components/SearchPage";
import SiteCard from "./components/SiteCard";
import PurchasePage from "./components/PurchasePage";
import PurchaseHistory from "./components/PurhcasaeHistory";

function App() {
  return (
    <div className="bg-gray-200">
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/properties' element={<Properties/>}></Route>
          <Route path='/search' element={<SearchPage/>}></Route>
          <Route path='/card/:id' element={<SiteCard/>}></Route>
          <Route path='purchase/complete/:id' element={<PurchasePage/>}></Route>
          <Route path='/purchase-history' element={<PurchaseHistory/>}></Route>
        </Routes>
    </div>
  )
}

export default App
