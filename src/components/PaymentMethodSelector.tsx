"use client";
import Image from "next/image";

export type PaymentMethod = "instapay" | "wallet" | "";

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const INSTAPAY_LINK = "https://ipn.eg/S/khaledwaledd/instapay/6Lok2a";

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#0D3B5C] mb-1">
        Payment Method *
      </label>

      {/* InstaPay option */}
      <label
        className={`flex flex-col gap-0 rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
          ${value === "instapay" ? "border-[#3d1a6e] bg-[#f5f0ff]" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
      >
        {/* Radio row */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <input
            type="radio"
            name="payment_method"
            value="instapay"
            required
            checked={value === "instapay"}
            onChange={() => onChange("instapay")}
            className="w-4 h-4 accent-[#3d1a6e] cursor-pointer"
          />
          <Image src="/instapay-logo.png" alt="InstaPay" width={28} height={28} className="rounded-md" />
          <div className="flex-1">
            <span className="font-semibold text-sm text-[#3d1a6e]">InstaPay</span>
            <span className="text-gray-400 text-xs ml-2">Bank transfer via InstaPay Egypt</span>
          </div>
        </div>

        {/* Expanded details */}
        {value === "instapay" && (
          <div className="border-t-2 border-[#3d1a6e]/20 px-4 py-4 bg-white flex flex-col sm:flex-row items-center gap-5">
            <Image
              src="/instapay-qr.png"
              alt="InstaPay QR"
              width={110}
              height={110}
              className="rounded-xl border border-[#3d1a6e]/20 flex-shrink-0"
            />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-xs text-gray-500">Scan the QR code with your bank app, or send directly to:</p>
              <p className="font-bold text-[#3d1a6e] text-base tracking-wide">khaledwaledd@instapay</p>
              <a
                href={INSTAPAY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#3d1a6e] text-white text-sm font-semibold rounded-full hover:bg-[#2d1254] transition-colors w-fit mx-auto sm:mx-0"
              >
                <i className="fas fa-external-link-alt text-xs" /> Open InstaPay Link
              </a>
            </div>
          </div>
        )}
      </label>

      {/* Mobile Wallet option */}
      <label
        className={`flex flex-col gap-0 rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
          ${value === "wallet" ? "border-[#C8102E] bg-[#fff5f5]" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
      >
        {/* Radio row */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <input
            type="radio"
            name="payment_method"
            value="wallet"
            required
            checked={value === "wallet"}
            onChange={() => onChange("wallet")}
            className="w-4 h-4 accent-[#C8102E] cursor-pointer"
          />
          <Image src="/ewallet-logo.png" alt="Mobile Wallet" width={28} height={28} className="rounded-md" />
          <div className="flex-1">
            <span className="font-semibold text-sm text-[#C8102E]">Mobile Wallet</span>
            <span className="text-gray-400 text-xs ml-2">e& Cash / Fawry wallet transfer</span>
          </div>
        </div>

        {/* Expanded details */}
        {value === "wallet" && (
          <div className="border-t-2 border-[#C8102E]/20 px-4 py-4 bg-white flex flex-col sm:flex-row items-center gap-5">
            <Image
              src="/wallet-qr.png"
              alt="Wallet QR"
              width={110}
              height={110}
              className="rounded-xl border border-[#C8102E]/20 flex-shrink-0"
            />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-xs text-gray-500">Scan the QR code with your wallet app, or send directly to:</p>
              <p className="font-bold text-[#C8102E] text-xl tracking-widest">011 4370 6993</p>
              <p className="text-xs text-gray-400">After sending, keep your transfer receipt</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
