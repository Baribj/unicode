import { useState } from "react";

import { useSnackbar } from "notistack";
import SnackbarActionButton from "../components/SnackbarActionButton";
import { ApiSuccessResponse } from "@/schema/ApiResponse";

interface useFetchOptions {
  isExternal?: boolean;
  queryParams?: { [key: string]: string | string[] | undefined };
  showSuccessSnackbar?: boolean;
  showFaiLSnackbar?: boolean;
}

const api = process.env.NEXT_PUBLIC_API_URL;

export default function useFetch() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  async function makeRequest<Result = any>(
    endPoint: string,
    {
      isExternal = false,
      queryParams = {},
      showSuccessSnackbar = false,
      showFaiLSnackbar = true,
    }: useFetchOptions = {},
    init?: { body: { [key: string]: any } } & Omit<RequestInit, "body">
  ): Promise<ApiSuccessResponse<Result>> {
    setLoading(true);

    try {
      let url = isExternal ? endPoint : `${api}/${endPoint}`;

      if (Object.keys(queryParams).length > 0) {
        url += "?" + serializeQueryParams(queryParams);
      }

      const response = await fetch(url, {
        ...init,
        headers: {
          ...(init?.headers ? init.headers : {}),
          "Content-Type": "application/json",
        },
        body: init?.body ? JSON.stringify(init?.body) : null,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.errors[0].detail);
      }

      if (showSuccessSnackbar) {
        const message = res.message?.detail || "Operation was successful";

        enqueueSnackbar(message, {
          variant: "success",
          autoHideDuration: 3000,
          action: (snackBarKey) => {
            return SnackbarActionButton(() => {
              closeSnackbar(snackBarKey);
            });
          },
          style: {
            flexWrap: "nowrap",
          },
        });
      }

      return res;
    } catch (err: any) {
      if (showFaiLSnackbar) {
        const message = err.message || "Ops, something went wrong";
        enqueueSnackbar(message, {
          variant: "error",
          autoHideDuration: 3000,
          action: (snackBarKey) => {
            return SnackbarActionButton(() => {
              closeSnackbar(snackBarKey);
            });
          },
          style: {
            flexWrap: "nowrap",
          },
        });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { makeRequest, loading };
}

/**
 * A helper function so query params can be passed as an object
 * @param params
 * @returns
 */
export function serializeQueryParams(params: { [key: string]: any }) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      params[key].forEach((value: any) => searchParams.append(key, value));
    } else {
      searchParams.append(key, params[key]);
    }
  });

  return searchParams.toString();
}
