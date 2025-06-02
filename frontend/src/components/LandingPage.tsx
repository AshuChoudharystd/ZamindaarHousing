import bg from "../assets/bg.jpeg";
import Navbar from "./Navbar";
import Footer from './Footer'
import Properties from "./Properties";

const LandingPage = () => {
  return (
    <div className="scroll-smooth">
        <Navbar/>
    <div className="">
      <div className="relative">
        <img src={bg} className="w-full h-screen rounded-lg" />
        <h1 className="w-200 text-4xl text-indigo-900 font-semibold relative bottom-140 left-150">
          Explore top listings in metro cities and growing towns, all verified
          for your peace of mind. From luxury apartments to budget-friendly
          flats and independent houses, we help you find homes that match your
          lifestyle and budget.
        </h1>
        <br />
        <h1 className="w-200 text-4xl text-indigo-900 font-semibold relative bottom-130 left-150">
          Start your property journey with confidence — search smarter, live
          better.
        </h1>
        <div className="relative bottom-40">
          <div><Properties/></div>
        </div>
      </div>
    </div>
    <br />
    <br />
    <br /> 
    <br />
    <Footer/>
    </div>
  );
};

export default LandingPage;
