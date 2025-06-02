import axios from "axios";
import { useState, useEffect } from "react";
const url = import.meta.env.VITE_Backend_Url;

interface Purchase {
  id: number;
  userId: string;
  priceSite: number;
  createdAt: string;
  siteId: number;
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const mockData: Purchase[] = await axios.get(
          `${url}user/purchase-history`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setPurchases(mockData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left">Property Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Purchase Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;

/*
<div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left">Property Name</th>
                            <th className="px-6 py-3 text-left">Price</th>
                            <th className="px-6 py-3 text-left">Purchase Date</th>
                            <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr key={purchase.id} className="border-t border-gray-300">
                                <td className="px-6 py-4">{purchase.propertyName}</td>
                                <td className="px-6 py-4">${purchase.price.toLocaleString()}</td>
                                <td className="px-6 py-4">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded ${
                                        purchase.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {purchase.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {purchases.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No purchase history found.
                </div>
            )}
        </div>
*/
