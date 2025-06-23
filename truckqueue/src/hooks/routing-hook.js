// routing-hook.js
import { useNavigate } from "react-router-dom";

export function useRouting() {
  const navigate = useNavigate();
  return { navigatePage: (path) => navigate(path) };
}
