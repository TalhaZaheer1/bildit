import { createUploadthing,type FileRouter  } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";


const f = createUploadthing()
const checkAuth = async () => {
    const user = auth();
    console.log("yayyyyyy")
    if(!user) throw new Error("User not logged in")
    return user
}


export const ourFileRouter = {
    agencyLogo:f({image:{maxFileSize:"4MB"}})
    .middleware(async () => await checkAuth())
    .onUploadComplete(() => {
        console.log("YAYYYYYYYYY")
    }),
    subAccountLogo:f({image:{maxFileSize:"4MB"}})
    .middleware(async () => await checkAuth())
    .onUploadComplete(() => {}),
    avatar:f({image:{maxFileSize:"4MB"}})
    .middleware(() => checkAuth())
    .onUploadComplete(() => {}),
    media:f({image:{maxFileSize:"4MB"}})
    .middleware(() => checkAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter;