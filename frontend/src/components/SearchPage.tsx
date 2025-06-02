import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import { useEffect } from "react";

const SearchPage = () => {

  const navigate = useNavigate();

  if(localStorage.getItem('token')){
    return (<div className="bg-white flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="mt-30 mb-30 bg-white">
        <SearchBar></SearchBar>
      </div>
      <Footer></Footer>
    </div>)
  }
  else{
    useEffect(()=>{
      navigate('/login')
    },[])
  }
};

export default SearchPage;

/**
 
Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

 */
