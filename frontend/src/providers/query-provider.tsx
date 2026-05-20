"use client";

import { ApiErrorResponse } from "@/types/api";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { toast } from "sonner";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof ApiErrorResponse) {
              if (error.details && error.details.length > 0) {
                error.details.forEach((detail) => {
                  toast.error(detail.message);
                });
              } else {
                toast.error(error.message);
              }
            } else if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("An unexpected error occurred");
            }
          },
        }),
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof ApiErrorResponse) {
              if (error.details && error.details.length > 0) {
                error.details.forEach((detail) => {
                  toast.error(detail.message);
                });
              } else {
                toast.error(error.message);
              }
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
