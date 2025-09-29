// AdminVendorDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/api";
import ForwardButton from "../../components/ForwardButton";

const AdminVendorDetail = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
      const fetchVendor = async () => {
    try {
      const res = await axios.get(`/api/admin/vendors/${vendorId}`);
      setVendor(res.data.vendor);
    } catch (error) {
        console.log(error)
      alert("Error fetching vendor details");
    }
  };
  fetchVendor();
  }, [vendorId]);


  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <div className="p-8 text-white min-h-screen bg-gray-900">
      <div className="flex justify-end">
        <ForwardButton label="All Vendors" page="/admin/vendors" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Vendor Details</h1>
      <p><strong>Name:</strong> {vendor.name}</p>
      <p><strong>Email:</strong> {vendor.email}</p>
      <p><strong>Status:</strong> {vendor.isSuspended ? "Suspended" : "Active"}</p>
    </div>
  );
};

export default AdminVendorDetail;
