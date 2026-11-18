import React, { createContext, useState, useContext, useRef } from "react";
import { getAxios } from "../Config/AxiosConfig";

export const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [assetList, setAssetList] = useState([]);
   const [intializeassetvalues, setIntializeAssetValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [assetsLoadingMore, setAssetsLoadingMore] = useState(false);
  const [assetPagination, setAssetPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemPerPage: 10,
  });
  const assetRequestId = useRef(0);
  const assetFetchingRef = useRef(false);
  // Page tracking from each response (refs, so load-more never reads stale
  // state or depends on the response's pagination key names).
  const assetPageRef = useRef(1);
  const assetHasMoreRef = useRef(false);

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    "Something went wrong";


  const getAllAssets = async (hostelId, options = {}) => {
    const { page = 1, size = 10, showLoader = true } = options;
    const isFirstPage = page === 1;

    // Load-more requests are skipped while another fetch is running;
    // a page-1 request (initial load / refresh after add/edit/delete) always runs.
    if (!isFirstPage && assetFetchingRef.current) {
      return { success: false };
    }

    const requestId = ++assetRequestId.current;
    assetFetchingRef.current = true;

    if (isFirstPage) {
      assetPageRef.current = 1;
      assetHasMoreRef.current = false;
      if (showLoader) setLoading(true);
    } else {
      setAssetsLoadingMore(true);
    }
    setErrorMsg("");

    try {
      const axios = getAxios();
      const res = await axios.get(`/v2/assets/${hostelId}`, {
        params: { page, size },
      });

      // Ignore responses superseded by a newer request.
      if (requestId !== assetRequestId.current) {
        return { success: false };
      }

      if (res.status === 200) {
        const data = res?.data || {};
        console.log("AssestAllDetails",data)
        const list = Array.isArray(data?.assetsList) ? data.assetsList : [];

        // API may send pagination top-level or nested, as totalPages or
        // totalPage. Without it: a full page means there may be more.
        const pagination = data?.pagination || data?.paginationSummary || data;
        const respPage = Number(pagination?.currentPage) || page;
        const respTotalPages = Number(
          pagination?.totalPages ?? pagination?.totalPage
        );

        if (isFirstPage || list.length > 0) {
          assetPageRef.current = respPage;
        }
        assetHasMoreRef.current =
          Number.isFinite(respTotalPages) && respTotalPages > 0
            ? respPage < respTotalPages
            : list.length >= size;

        setAssetList((prev) => {
          if (isFirstPage) return list;
          const existing = new Set(prev.map((a) => a?.assetId));
          return [...prev, ...list.filter((a) => !existing.has(a?.assetId))];
        });

        setAssetPagination({
          currentPage: assetPageRef.current,
          totalPages:
            Number.isFinite(respTotalPages) && respTotalPages > 0
              ? respTotalPages
              : 1,
          itemPerPage: Number(data?.itemPerPage) || size,
        });

        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.log("GET ASSET ERROR 👉", err.response?.data);
      setErrorMsg(getErrorMessage(err));
      return { success: false, message: getErrorMessage(err) };
    } finally {
      if (requestId === assetRequestId.current) {
        assetFetchingRef.current = false;
        if (isFirstPage) {
          if (showLoader) setLoading(false);
        } else {
          setAssetsLoadingMore(false);
        }
      }
    }
  };

  // Fetches the next page of assets, if there is one.
  const loadMoreAssets = async (hostelId, size = 10) => {
    if (!hostelId || assetFetchingRef.current || !assetHasMoreRef.current) {
      return { success: false };
    }

    return getAllAssets(hostelId, {
      page: assetPageRef.current + 1,
      size,
      showLoader: false,
    });
  };

  const addAsset = async (payload) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios()
      const res = await axios.post(
        `/v2/assets/${payload.hostelId}`,
        payload
      );

      if (res.status === 200) {
        await getAllAssets(payload.hostelId);

        return {
          success: true,
          data: res.data,
          message: "Asset created successfully",
        };
      }

      return { success: false };
    } catch (err) {
      const msg =
        err?.response?.data === "Serial number already exists"
          ? "Serial number already exists"
          : err?.response?.data || "Failed to add asset";

      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateAsset = async (payload) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios()
      const res = await axios.put(
        `/v2/assets/${payload.hostelId}/${payload.assetId}`,
        payload
      );

      if (res.status === 200) {
        await getAllAssets(payload.hostelId);

        return {
          success: true,
          data: res.data,
          message: "Asset updated successfully",
        };
      }

      return { success: false };
    } catch (err) {
      console.log("UPDATE ASSET ERROR", err?.response);

      const msg =
        err?.response?.status === 403
          ? "You don’t have permission to update this asset"
          : err?.response?.data || "Failed to update asset";

      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };


  const assignAsset = async (payload) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios()
      const res = await axios.put(
        `/v2/assets/assign/${payload.assetId}`,
        payload
      );

      if (res.status === 200) {
        // refresh asset list after assign
        await getAllAssets(payload.hostelId);

        return {
          success: true,
          message: res.data || "Asset assigned successfully",
        };
      }

      return { success: false };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to assign asset";

      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };






  const deleteAsset = async (assetId, hostelId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios()
      const res = await axios.delete(`/v2/assets/${assetId}`);

      if (res.status === 200) {
        await getAllAssets(hostelId);
        return {
          success: true,
          message: "Asset deleted successfully",
        };
      }

      return { success: false };
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const InitializeAssets = async (hostelId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios();

      const res = await axios.get(
        `/v2/assets/initialize/${hostelId}`
      );

      if (res?.status === 200) {
        setIntializeAssetValues(res?.data)
        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      console.log(
        "INITIALIZE ASSETS ERROR 👉",
        err?.response?.data
      );

      const message = getErrorMessage(err);
      setErrorMsg(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };



  return (
    <AssetContext.Provider
      value={{
        assetList,intializeassetvalues,
        loading,
        errorMsg,
        getAllAssets,
        loadMoreAssets,
        assetsLoadingMore,
        assetPagination,
        addAsset,
        handleUpdateAsset,
        deleteAsset,
        assignAsset, InitializeAssets , 
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

