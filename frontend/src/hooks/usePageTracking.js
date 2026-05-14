import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    let sessionKey = sessionStorage.getItem("aivora_session");
    if (!sessionKey) {
      sessionKey = crypto.randomUUID?.() ?? String(Date.now());
      sessionStorage.setItem("aivora_session", sessionKey);
    }
    const path = location.pathname + location.search;
    api
      .post("/analytics/track/", {
        path,
        referrer: document.referrer || "",
        session_key: sessionKey,
      })
      .catch(() => {});
  }, [location]);
}
