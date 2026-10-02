import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/providers"; // Fayl adınızın registrinə uyğun (providers və ya Providers)
import "./globals.css";
import PublicNavbar from "@/components/public/PublicNavbar";
import Footer from "@/components/public/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="az">
        <body>
          <PublicNavbar />
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}