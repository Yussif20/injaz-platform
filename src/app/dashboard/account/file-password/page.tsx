"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function FilePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save changes");
  };

  const handleDeactivate = () => {
    // TODO: Implement deactivate functionality
    console.log("Deactivate");
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8">
      {/* Password Input Section */}
      <div className="flex flex-col gap-2 mb-8">
        <label className="text-base font-normal text-[#333]">
          كلمة المرور الحالية
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-[#333] placeholder:text-[#B3B3B3] text-sm text-right px-3 py-2 pl-10 border border-[#EBEBEB] rounded-2xl transition-colors duration-200 focus:border-primary-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
            tabIndex={-1}
          >
            <Image
              src={showPassword ? "/icons/ui/unlock.svg" : "/icons/ui/lock.svg"}
              alt={showPassword ? "hide password" : "show password"}
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-52 lg:w-72.5 h-12 sm:h-13 lg:h-13.5 bg-primary-500 text-white text-base sm:text-lg font-light rounded-3xl hover:bg-primary-700 transition-colors"
        >
          حفظ التغييرات
        </button>
        <button
          type="button"
          onClick={handleDeactivate}
          className="w-full sm:w-52 lg:w-72.5 h-12 sm:h-13 lg:h-13.5 bg-white text-[#B1363e] text-base sm:text-lg font-light border-2 border-[#B1363e] rounded-3xl hover:bg-[#B1363e]/5 transition-colors"
        >
          إلغاء التفعيل
        </button>
      </div>
    </div>
  );
}
