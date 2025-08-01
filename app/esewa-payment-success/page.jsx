'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const EsewaSuccessPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { getToken, setCartItems } = useAppContext();

  useEffect(() => {
    const verifyEsewa = async () => {
      const data = {
        amt: params.get("amt"),
        rid: params.get("refId"),
        pid: params.get("oid"),
      };

      try {
        const res = await axios.post("/api/esewa/verify", data, {
          headers: { Authorization: await getToken() },
        });
        toast.success("Payment Verified Successfully 🎉");
        setCartItems([]);
        router.push("/my-orders");
      } catch (err) {
        toast.error("Payment Verification Failed");
        router.push("/cart");
      }
    };

    if (params.get("refId")) verifyEsewa();
  }, [params]);

  return <div className="p-10 text-xl">Verifying Payment...</div>;
};

export default EsewaSuccessPage;
