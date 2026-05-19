// 'use client';

// import { useEffect, useState } from 'react';
// import { useNavigate } from '@tanstack/react-router';
// import { requestOTP, verifyOTP } from '@/lib/auth-api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';

// export function AuthPage() {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Request OTP on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         await requestOTP();
//         toast.success('OTP sent to your registered contact');
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Failed to request OTP';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       setError('Please enter a valid OTP');
//       return;
//     }

//     try {
//       setIsVerifying(true);
//       setError(null);
//       await verifyOTP(otp);
//       toast.success('Authenticated successfully!');
//       // Redirect to the app
//       navigate({ to: '/create' });
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//     setOtp(value);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
//       <div className="w-full max-w-md">
//         <div className="rounded-lg bg-white p-8 shadow-lg">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Please enter the OTP to proceed
//             </p>
//           </div>

//           <form onSubmit={handleVerify} className="mt-8 space-y-6">
//             <div>
//               <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
//                 OTP Code
//               </label>
//               <Input
//                 id="otp"
//                 type="text"
//                 inputMode="numeric"
//                 placeholder="Enter 6-digit OTP"
//                 value={otp}
//                 onChange={handleOtpChange}
//                 disabled={isLoading || isVerifying}
//                 className="mt-2"
//                 maxLength={6}
//                 autoComplete="off"
//               />
//             </div>

//             {error && (
//               <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
//                 {error}
//               </div>
//             )}

//             <Button
//               type="submit"
//               disabled={isLoading || isVerifying || otp.length < 4}
//               className="w-full"
//             >
//               {isVerifying ? 'Verifying...' : 'Verify OTP'}
//             </Button>
//           </form>

//           {isLoading && (
//             <div className="mt-6 text-center text-sm text-gray-600">
//               <p>Requesting OTP...</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { requestOTP, verifyOTP } from '@/lib/auth-api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCcw } from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [retryCount, setRetryCount] =
    useState(0);

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  // REQUEST OTP
  useEffect(() => {
    handleRequestOtp();
  }, []);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);

      setError(null);

      await requestOTP();

      toast.success('OTP sent successfully');

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to request OTP';

      setError(errorMessage);

      toast.error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (
    otpValue?: string
  ) => {

    const finalOtp =
      otpValue || otp.join('');

    if (finalOtp.length !== 6) {
      setError(
        'Please enter valid 6 digit OTP'
      );
      return;
    }

    try {
      setIsVerifying(true);

      setError(null);

      await verifyOTP(finalOtp);

      toast.success(
        'Authenticated successfully!'
      );

      navigate({ to: '/create' });

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Invalid OTP';

      setError(errorMessage);

      toast.error(errorMessage);

      // CLEAR OTP AFTER WRONG OTP
      setOtp(['', '', '', '', '', '']);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } finally {
      setIsVerifying(false);
    }
  };

  // OTP CHANGE
  const handleChange = (
    value: string,
    index: number
  ) => {

    const cleaned =
      value.replace(/\D/g, '');

    // EMPTY VALUE
    if (cleaned === '') {

      const updatedOtp = [...otp];

      updatedOtp[index] = '';

      setOtp(updatedOtp);

      return;
    }

    const updatedOtp = [...otp];

    updatedOtp[index] = cleaned[0];

    setOtp(updatedOtp);

    // MOVE NEXT
    if (index < 5) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }

    const finalOtp =
      updatedOtp.join('');

    // AUTO VERIFY
    if (finalOtp.length === 6) {
      handleVerifyOtp(finalOtp);
    }
  };

  // BACKSPACE FIX
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {

    if (e.key === 'Backspace') {

      e.preventDefault();

      const updatedOtp = [...otp];

      // REMOVE CURRENT VALUE
      if (updatedOtp[index]) {

        updatedOtp[index] = '';

        setOtp(updatedOtp);

        return;
      }

      // MOVE PREVIOUS
      if (index > 0) {

        updatedOtp[index - 1] = '';

        setOtp(updatedOtp);

        inputRefs.current[
          index - 1
        ]?.focus();
      }
    }
  };

  // PASTE SUPPORT
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {

    e.preventDefault();

    const pastedData =
      e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!pastedData) return;

    const updatedOtp = [
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    pastedData
      .split('')
      .forEach((char, index) => {
        updatedOtp[index] = char;
      });

    setOtp(updatedOtp);

    // AUTO VERIFY
    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  // RESEND OTP
  const handleResend = async () => {

    if (retryCount >= 3) {
      toast.error(
        'Maximum resend attempts reached'
      );
      return;
    }

    try {
      setRetryCount((prev) => prev + 1);

      setOtp([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      setError(null);

      await requestOTP();

      toast.success(
        'OTP resent successfully'
      );

      inputRefs.current[0]?.focus();

    } catch (err) {
      toast.error(
        'Failed to resend OTP'
      );
    }
  };

  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gradient-to-br
        from-[#F8FAFC]
        to-[#EEF5F2]
        px-4
      "
    >
      <div className="w-full max-w-md">

        <div
          className="
            rounded-[32px]
            border
            border-[#02634E]/10
            bg-white
            p-8
            shadow-xl
          "
        >

          {/* HEADER */}
          <div className="text-center">

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#02634E]/10
              "
            >
              🔐
            </div>

            <h1 className="text-3xl font-bold text-[#02634E]">
              Verify OTP
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter the 6 digit OTP sent to your
              registered contact
            </p>

          </div>

          {/* OTP BOXES */}
          <div className="mt-8 flex items-center justify-center gap-3">

            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] =
                    el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={1}
                value={digit}
                disabled={
                  isLoading ||
                  isVerifying
                }
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    index
                  )
                }
                onPaste={handlePaste}
                onFocus={(e) =>
                  e.target.select()
                }
                className={`
                  h-14
                  w-14
                  rounded-2xl
                  border-2
                  text-center
                  text-xl
                  font-bold
                  outline-none
                  transition-all
                  ${
                    digit
                      ? 'border-[#02634E] bg-[#02634E]/5 text-[#02634E]'
                      : 'border-gray-200 bg-white'
                  }
                  focus:border-[#02634E]
                  focus:ring-4
                  focus:ring-[#02634E]/10
                `}
              />
            ))}

          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                mt-5
                rounded-2xl
                border
                border-red-100
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* VERIFY BUTTON */}
          <Button
            onClick={() =>
              handleVerifyOtp()
            }
            disabled={
              isLoading ||
              isVerifying ||
              otp.join('').length !== 6
            }
            className="
              mt-6
              h-12
              w-full
              rounded-2xl
              bg-[#02634E]
              text-white
              hover:bg-[#01503F]
            "
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </Button>

          {/* RESEND */}
          <div className="mt-6 text-center">

            <button
              onClick={handleResend}
              disabled={
                retryCount >= 3
              }
              className={`
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                transition
                ${
                  retryCount >= 3
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-[#02634E] hover:opacity-80'
                }
              `}
            >
              <RefreshCcw size={15} />

              {retryCount >= 3
                ? 'Resend limit reached'
                : `Resend OTP (${3 - retryCount} left)`}
            </button>

          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="mt-5 text-center text-sm text-gray-500">
              Requesting OTP...
            </div>
          )}

        </div>
      </div>
    </div>
  );
}