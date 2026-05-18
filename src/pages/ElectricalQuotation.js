import React, { useEffect, useMemo, useState, useRef } from 'react';
import { quotationsAPI, customersAPI, pricingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BRANDS = ['Havells','Finolex','GM','Polycab','Goldmedal','Apar','V-Guard'];

const defaultTerms = `Including taxes @18%
Validity only 3 days
Material supply 7 working days`;

const ElectricalQuotation = () => {
  const { user, isStoreAdmin, getStore } = useAuth();
  const [dateOfOffer] = useState(() => new Date().toISOString().slice(0,10));
  const [customerName, setCustomerName] = useState('');
  const [brand, setBrand] = useState('Havells');
  const [rows, setRows] = useState([
    { description: '1.0 Sqmm 90 Mtrs', quantity: 1, listPrice: 0, coilPrice: 0 }
  ]);
  const [terms, setTerms] = useState(defaultTerms);
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    if (!user || (isStoreAdmin() && getStore() !== 'electrical')) {
      toast.error('Access denied: Electrical store admins only');
    }
  }, [user]);

  useEffect(() => {
    // Optionally preload pricing for the selected brand
    const loadPricing = async () => {
      try {
        const res = await pricingAPI.getByBrand(brand);
        if (res?.data?.pricing?.items?.length) {
          // Do nothing immediate; could be used to provide quick-fill
        }
      } catch {}
    };
    loadPricing();
  }, [brand]);

  const addRow = () => setRows(prev => [...prev, { description: '', quantity: 1, listPrice: 0, coilPrice: 0 }]);
  const removeRow = (idx) => setRows(prev => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, key, value) => setRows(prev => prev.map((r, i) => i === idx ? { ...r, [key]: value } : r));

  const computed = useMemo(() => {
    const items = rows.map(r => ({
      ...r,
      quantity: Number(r.quantity) || 0,
      listPrice: Number(r.listPrice) || 0,
      coilPrice: Number(r.coilPrice) || 0,
      lineTotal: (Number(r.quantity) || 0) * (Number(r.coilPrice) || 0)
    }));
    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    const gst = +(subtotal * 0.18).toFixed(2);
    const grand = +(subtotal + gst).toFixed(2);
    return { items, subtotal, gst, grand };
  }, [rows]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!customerName.trim()) return toast.error('Customer name is required');
      const payload = {
        brand,
        customerName: customerName.trim(),
        items: computed.items.map(({ description, quantity, listPrice, coilPrice }) => ({ description, quantity, listPrice, coilPrice })),
        terms,
        dateOfOffer
      };
      const res = await quotationsAPI.create(payload);
      toast.success(`Saved quotation ${res.data.quotation.quotationNumber}`);
    } catch (err) {
      toast.error(err.message || 'Failed to save quotation');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    window.print();
  };

  const handleExportPdf = async () => {
    try {
      const input = printRef.current;
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`AyeshaElectrical_Quotation_${Date.now()}.pdf`);
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ayesha Electrical - Quotation</h1>
          <div className="space-x-2">
            <button onClick={handleSave} disabled={loading} className="btn-primary px-4 py-2">Save Quotation</button>
            <button onClick={handlePrint} className="px-4 py-2 border rounded">Print</button>
            <button onClick={handleExportPdf} className="px-4 py-2 border rounded">Export PDF</button>
          </div>
        </div>

        <div ref={printRef} className="bg-white shadow rounded p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Ayesha Electrical</h2>
              <p className="text-sm text-gray-600">Quotation / Offer</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <label className="text-sm text-gray-700">Brand</label>
              <select value={brand} onChange={(e)=>setBrand(e.target.value)} className="border rounded px-2 py-1">
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Customer and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700">Customer Name</label>
              <input value={customerName} onChange={(e)=>setCustomerName(e.target.value)} className="input-field w-full" placeholder="Enter customer name" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Date of Offer</label>
              <input value={dateOfOffer} readOnly className="input-field w-full bg-gray-100" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="bg-red-600 text-white px-3 py-2 text-left">Description</th>
                  <th className="bg-blue-600 text-white px-3 py-2 text-right">Quantity</th>
                  <th className="bg-blue-600 text-white px-3 py-2 text-right">List Price (₹)</th>
                  <th className="bg-blue-600 text-white px-3 py-2 text-right">Coil Price (₹)</th>
                  <th className="bg-blue-600 text-white px-3 py-2 text-right">Line Total (₹)</th>
                  <th className="bg-blue-600 text-white px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-3 py-2">
                      <input value={r.description} onChange={(e)=>updateRow(idx,'description',e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g., 1.0 Sqmm 90 Mtrs" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" min="0" value={r.quantity} onChange={(e)=>updateRow(idx,'quantity',e.target.value)} className="w-24 border rounded px-2 py-1 text-right" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" min="0" value={r.listPrice} onChange={(e)=>updateRow(idx,'listPrice',e.target.value)} className="w-28 border rounded px-2 py-1 text-right" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" min="0" value={r.coilPrice} onChange={(e)=>updateRow(idx,'coilPrice',e.target.value)} className="w-28 border rounded px-2 py-1 text-right" />
                    </td>
                    <td className="px-3 py-2 text-right">{(Number(r.quantity||0)*Number(r.coilPrice||0)).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={()=>removeRow(idx)} className="text-red-600">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <button onClick={addRow} className="px-3 py-1 border rounded">Add Row</button>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Terms & Conditions</label>
              <textarea value={terms} onChange={(e)=>setTerms(e.target.value)} className="w-full border rounded p-2" rows={4} />
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="w-full md:w-80 flex justify-between"><span>Subtotal</span><span>₹ {computed.subtotal.toFixed(2)}</span></div>
              <div className="w-full md:w-80 flex justify-between"><span>GST (18%)</span><span>₹ {computed.gst.toFixed(2)}</span></div>
              <div className="w-full md:w-80 flex justify-between bg-yellow-100 px-2 py-1 font-semibold"><span>Grand Total</span><span>₹ {computed.grand.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t pt-2 text-sm text-gray-600">
            <div>Ayesha Electrical • Contact: +91-9885327992 • Proprietor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricalQuotation;


