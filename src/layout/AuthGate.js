import { useDispatch, useSelector } from "react-redux";
import { initializeAuthAsync } from "../store/thunks/authThunks";
import { useEffect } from "react";

export const AuthGate = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthAsync());
  }, [dispatch]);

  return loading ? null : <>{children}</>;
};
