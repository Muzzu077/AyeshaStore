import React, { useEffect, useState } from 'react';
import { quotationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ElectricalQuotationHistory = () => {
  const { isStoreAdmin, getStore } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await quotationsAPI.list();
        setList(res.data.quotations || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!isStoreAdmin() || getStore() !== 'electrical') {
    return <div className="p-4">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold">Electrical Quotations</h1>
          <button onClick={()=>navigate('/admin/quotations/new')} className="btn-primary px-3 py-2">New Quotation</button>
        </div>
        <div className="p-4">
          {loading ? (
            <div>Loading...</div>
          ) : list.length === 0 ? (
            <div>No quotations yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Quotation #</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Brand</th>
                    <th className="px-3 py-2 text-right">Grand Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(q => (
                    <tr key={q._id} className="border-b">
                      <td className="px-3 py-2">{q.quotationNumber}</td>
                      <td className="px-3 py-2">{new Date(q.dateOfOffer).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{q.customerName}</td>
                      <td className="px-3 py-2">{q.brand}</td>
                      <td className="px-3 py-2 text-right">{q.grandTotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectricalQuotationHistory;


