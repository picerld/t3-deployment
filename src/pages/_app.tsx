// import { AppProps } from "next/app";
// import { trpc, trpcClientOptions } from "@/utils/trpc";
// import { httpBatchLink } from "@trpc/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";

// import "@/styles/globals.css";
// import { Toaster } from "@/components/ui/sonner";

// import { Poppins } from "next/font/google";
// import { ThemeProvider } from "@/components/ui/theme-provider";
// import { authErrorLink } from "@/utils/trpcLinks";

// const poppins = Poppins({
//   subsets: ["latin"],
//   variable: "--font-poppins",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
// });

// function MyApp({ Component, pageProps }: AppProps) {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       links: [
//         httpBatchLink({
//           url: "/api/trpc",
//           fetch(url, options) {
//             return fetch(url, {
//               ...options,
//               credentials: "include",
//             });
//           },
//         }),
//       ],
//       ...trpcClientOptions,
//     })
//   );

//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <div className={poppins.className}>
//             <Component {...pageProps} />

//             <Toaster />
//           </div>
//         </ThemeProvider>
//       </QueryClientProvider>
//     </trpc.Provider>
//   );
// }

// export default MyApp;

import { AppProps } from "next/app";
import { trpc, trpcClientOptions } from "@/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { api } from "@/utils/api";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className={poppins.className}>
        <Component {...pageProps} />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);
