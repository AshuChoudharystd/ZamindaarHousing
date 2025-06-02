import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_Backend_Url; // Make sure this is defined in your .env file

interface Property {
  id:number
  imageUrl: string;
  place: string;
  price: string;
}

const Properties = () => {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}`);
        setData(res.data.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <p className="text-5xl flex h-screen justify-center items-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-xl">Failed to load properties.</p>;
  }

  return (
    <div>
      <h1 className="text-5xl text-center font-bold text-indigo-800 pb-25" id="sites">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {data.map((item, index) => (
        <div
          key={index}
          className="border-indigo-400 border-4 rounded-lg p-2 shadow-md hover:scale-105 hover:cursor-pointer hover:bg-indigo-400 focus:outline-2"
          onClick={(e)=>{
            e.preventDefault();
            navigate(`/card/${item.id}`);
          }}
        >
          <img
            src={`http://localhost:3000/api/v1/uploads/${item.imageUrl}`}
            alt={`Property ${index}`}
            className="w-full h-48 object-cover rounded"
          />
          <div className="flex justify-between items-center text-2xl font-medium border-indigo-700 border-t-4 rounded-t-md pt-2 pb-2">
            <h1>{`${item.place}`}</h1>
            <h1>{`₹${item.price}`}</h1>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Properties;
