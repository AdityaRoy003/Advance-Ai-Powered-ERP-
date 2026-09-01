import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FacilitiesAPI } from '../../services/api';
import { 
  FaBoxes, FaShoppingCart, FaPlus, FaCheckCircle, 
  FaExclamationTriangle, FaWarehouse, FaFileInvoiceDollar, FaTruck 
} from 'react-icons/fa';

export default function InventoryProcurement() {
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | procurement
  const [items, setItems] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPRModal, setShowPRModal] = useState(false);
  const [dept, setDept] = useState('Computer Science');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [estCost, setEstCost] = useState(10000);
  const [vendor, setVendor] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, prRes] = await Promise.all([
        FacilitiesAPI.getInventoryItems(),
        FacilitiesAPI.getProcurementRequests()
      ]);
      setItems(invRes);
      setProcurements(prRes);
    } catch (err) {
      console.error('Inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePR = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error('Item name required');
      return;
    }

    try {
      await FacilitiesAPI.createProcurementRequest({
        department: dept,
        items: [{ name: itemName, quantity: Number(itemQty), estimatedCost: Number(estCost) }],
        totalEstimatedCost: Number(estCost),
        vendorName: vendor || 'Pending Vendor Bid'
      });
      toast.success('Procurement request submitted to Finance!');
      setShowPRModal(false);
      setItemName('');
      fetchData();
    } catch {
      toast.error('Failed to submit PR');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xl">
              <FaBoxes />
            </span>
            <div>
              <h1 className="text-2xl font-black">Inventory & Procurement Management</h1>
              <p className="text-slate-400 text-xs mt-0.5">Asset registers, minimum threshold alerts & purchase order requisition lifecycle</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' : 'text-slate-400 hover:text-white'}`}
          >
            <FaWarehouse />
            <span>Asset Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('procurement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'procurement' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' : 'text-slate-400 hover:text-white'}`}
          >
            <FaShoppingCart />
            <span>Procurement & POs</span>
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Total Tracked Items</p>
              <p className="text-2xl font-black text-white mt-1">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Low Stock Alerts</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{items.filter(i => i.status === 'Low Stock').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Warehouse Valuation</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">₹{items.reduce((s, i) => s + (i.quantityInStock * i.unitPrice), 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h2 className="text-sm font-bold">Institutional Asset & Consumable Registry</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 text-xxs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Item Code</th>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Unit Cost</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {items.map(it => (
                    <tr key={it.itemCode} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-indigo-400">{it.itemCode}</td>
                      <td className="p-4 font-bold text-white">{it.name}</td>
                      <td className="p-4 text-slate-400">{it.category}</td>
                      <td className="p-4 font-semibold">{it.quantityInStock} {it.unit}</td>
                      <td className="p-4 text-slate-400">{it.location}</td>
                      <td className="p-4 font-mono">₹{it.unitPrice?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold ${it.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {it.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'procurement' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold">Purchase Requisitions (PR) & Purchase Orders (PO)</h2>
            <button
              onClick={() => setShowPRModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/25"
            >
              <FaPlus />
              <span>New Requisition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procurements.map(pr => (
              <div key={pr.prNumber} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xxs font-mono font-bold text-indigo-400">{pr.prNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-xxs">
                      {pr.stage}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{pr.items?.[0]?.name || 'Requisition Item'}</h3>
                  <p className="text-xs text-slate-400 mb-3">{pr.department} • Req by {pr.requestedByName}</p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">Estimated Cost:</span>
                    <span className="font-bold text-emerald-400 font-mono">₹{pr.totalEstimatedCost?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xxs text-slate-400">
                  <span>Vendor: {pr.vendorName || 'Vendor Bidding'}</span>
                  {pr.poNumber && <span className="font-mono text-indigo-400 font-bold">{pr.poNumber}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showPRModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-[#111827] p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-white mb-4">Create Purchase Requisition</h2>
            <form onSubmit={handleCreatePR} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Department</label>
                <input value={dept} onChange={e => setDept(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Item Description</label>
                <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. GPU Workstations" className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Quantity</label>
                  <input type="number" value={itemQty} onChange={e => setItemQty(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Est. Cost (₹)</label>
                  <input type="number" value={estCost} onChange={e => setEstCost(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Preferred Vendor</label>
                <input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g. CompuTech Enterprise" className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPRModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">Submit to Finance</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
