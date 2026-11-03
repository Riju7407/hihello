"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface CustomerAccount {
  customerId: string;
  externalCustomerId: string;
  email: string;
  name: string;
}

export function useCustomer() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: account,
    isLoading,
    isError,
    refetch,
  } = useQuery<CustomerAccount | null>({
    queryKey: ["customer_session"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data.success ? data.data : null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["customer_session"], null);
      router.push("/login");
      router.refresh();
    },
  });

  return {
    customer: account,
    isAuthenticated: Boolean(account),
    isLoading,
    isError,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetchCustomer: refetch,
  };
}

