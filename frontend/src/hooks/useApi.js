import { useEffect, useState } from "react";

const useApi = (
  apiFunction,
  dependencies = []
) => {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await apiFunction();

        setData(response.data);

      } catch (err) {

        setError(
          err?.response?.data?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, dependencies);

  return {
    data,
    loading,
    error,
  };

};

export default useApi;