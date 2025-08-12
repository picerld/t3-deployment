import { type AppProps } from "next/app";

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
