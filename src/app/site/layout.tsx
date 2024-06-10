import Navigation from "@/components/site/navigaiton";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function MainLayout({children}:{
    children:React.ReactNode
}) {
    return (
        <ClerkProvider appearance={{baseTheme:dark}}>
        <main className="h-full">
            <Navigation />
            {children}
        </main>
        </ClerkProvider>
    );
}

export default MainLayout;