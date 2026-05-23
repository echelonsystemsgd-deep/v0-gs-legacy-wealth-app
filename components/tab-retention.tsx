"use client"

import { useEffect } from "react"

export function TabRetention() {
  useEffect(() => {
    let originalTitle = document.title;
    
    const handleBlur = () => {
      document.title = "👑 Build Your Legacy...";
    };

    const handleFocus = () => {
      document.title = originalTitle;
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return null;
}
