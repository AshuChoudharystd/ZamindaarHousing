import { useNavigate } from "react-router-dom";


const PurchasePage = () => {

    const navigate = useNavigate();

  return (<div className="text-5xl font-extrabold flex justify-center h-screen items-center">
    {"Payment Completed  \n"}
    {
      setTimeout(()=>{
        navigate('/')
      },5000)
    }
  </div>);
};
export default PurchasePage;
