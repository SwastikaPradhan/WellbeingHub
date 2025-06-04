"use client";

import { useRouter } from "next/navigation";
import { useState, MouseEventHandler } from "react";

export function ProfileBox() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const logout = () => {
    localStorage.clear();
    router.push("/");
    
  };

  const getName = localStorage.getItem("name") || "Swastika";

  return (
    <div className="relative cursor-pointer">
      <div onClick={() => setShow(!show)}>
       
        <Avatar name={getName} />
      </div>
      {show && (
        <div className="absolute -bottom-24 -left-16 shadow-lg p-4 bg-gray-50 border border-gray-100 z-50 w-[160px]">
          <div className="flex flex-col gap-3">
            <div onClick={logout} className="cursor-pointer hover:text-red-600">
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Avatar({
  name,
  onClick,
}: {
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onClick}
      className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 hover:bg-gray-50 rounded-full"
    >
      <span className="font-medium text-gray-600">
        {name.split(" ")?.[0]?.[0]}
        {name.split(" ")?.[1]?.[0]}
      </span>
    </div>
  );
}

export default ProfileBox;
