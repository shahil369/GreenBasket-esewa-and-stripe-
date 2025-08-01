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
    const verifyPayment = async () => {
      const oid = params.get('oid');
      const amt = params.get('amt');
      const refId = params.get('refId');
      const pid = params.get('pid');
      const orderId = params.get('orderId');

      if (!oid || !amt || !refId || !pid || !orderId) {
        toast.error('Invalid payment response.');
        setCartItems({}); // ❗ clear cart even if params are invalid
        return;
      }

      try {
        const token = await getToken();
        const { data } = await axios.post(
          '/api/verify-esewa-payment',
          { oid, amt, refId, pid, orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCartItems({}); // ❗ always clear cart regardless of outcome

        if (data.success) {
          toast.success('Payment Verified');
          router.replace('/my-orders');
        } else {
          toast.error(data.message || 'Payment Verification Failed');
        }
      } catch (error) {
        setCartItems({}); // ❗ also clear on network or server error
        toast.error('Something went wrong.');
      }
    };

    verifyPayment();
  }, [params, getToken, router, setCartItems]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-700">Verifying your payment...</p>
    </div>
  );
};

export default EsewaSuccessPage;
