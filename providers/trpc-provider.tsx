"use client";

import React from "react";
import { trpcClientReact, trpcPureClient } from "@/trpc-caller/client"
import { QueryClient } from "@tanstack/react-query";

const TrpcProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const queryClient = React.useMemo(() => new QueryClient(), []);
    return (
        <trpcClientReact.Provider client={trpcPureClient} queryClient={queryClient}>
            {children}
        </trpcClientReact.Provider>
    );
};


export default TrpcProvider;