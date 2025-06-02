import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const url = import.meta.env.VITE_Backend_Url;

interface Sites {
  id: number;
  place: string;
  description: string;
  price: number;
  imageUrl: string;
  contactEmail: string;
  contactPhone: string;
  sold: boolean;
}

const SiteCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // data is undefined until we fetch it
  const [data, setData] = useState<Sites | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!id) {
      setError("No site ID provided in URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}user/site/${id}`, {
          headers: { Authorization: token },
        });

        if (res.data && res.data.data) {
          setData(res.data.data as Sites);
        } else {
          setError(`No site found for ID ${id}`);
        }
      } catch (e: any) {
        console.error("Error fetching site:", e);
        setError(e?.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-5xl text-center font-bold h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-5xl text-center font-bold text-red-600 h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-5xl text-center font-bold h-screen flex items-center justify-center">
        No site data available.
      </div>
    );
  }

  return (
    <div className="pt-3 pb-3">
      <div>
        <div className="flex justify-center">
          <div>
            <img
              className="h-100 w-160"
              src={`http://localhost:3000/api/v1/uploads/${data.imageUrl}`}
              alt=""
            />
            <div className="">
              <div className="w-full flex justify-center">
                <p className="w-150">
                  <h1 className="text-3xl font-semibold mt-4 mb-3">
                    'Description:'
                  </h1>
                  <p className="text-lg font-semibold">{data.description}</p>
                </p>
              </div>
            </div>
          </div>
          <div className="ml-30 mt-20">
            {data.sold ? (
              <div className=''>
                <h1 className="text-center text-3xl font-semibold pt-2 pb-2 pl-3 pr-3 bg-red-700 text-white rounded-lg mb-15">
                  Sold
                </h1>
              </div>
            ) : (
              <div>
                <h1
                  className="text-center text-3xl font-semibold pt-2 pb-2 pl-3 pr-3 bg-indigo-700 text-white rounded-lg hover:scale-110 hover:bg-red-700 hover:text-white hover:cursor-pointer mb-15"
                  onClick={async () => {
                    try{
                      await axios.put(`${url}user/site/purchase/${data.id}`, {}, {
                      headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                      },
                    });
                    navigate(`/purchase/complete/${data.id}`);
                    }catch(err){
                      return (
                        <div className="text-5xl font-extrabold flex justify-center h-screen items-center">Cannot Lock Deal</div>
                      )
                    }
                    
                  }}
                >
                  Deal
                </h1>
              </div>
            )}
            <div className="">
              <h1 className="mt-10 mb-15 text-center text-3xl font-semibold pt-2 pb-2 pl-3 pr-3 bg-indigo-700 text-white rounded-lg hover:scale-110 hover:bg-red-700 hover:text-white hover:cursor-pointer">
                {`Phone:- ${data.contactPhone}`}
              </h1>
              <h1 className="mt-10 mb-15 text-center text-3xl font-semibold pt-2 pb-2 pl-3 pr-3 bg-indigo-700 text-white rounded-lg hover:scale-110 hover:bg-red-700 hover:text-white hover:cursor-pointer">
                {`email:- ${data.contactEmail}`}
              </h1>
            </div>
            <div className="text-4xl font-extrablod text-center mt-20">
              <h1 className="mb-10 pt-2 pb-2 pr-3 pl-3 border-2 border-black rounded-lg bg-red-300">Location:- {data.place}</h1>
              <h1 className="pt-2 pb-2 pr-3 pl-3 border-2 border-black rounded-lg bg-red-300">Price:- ₹{data.price}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteCard;
