
import { Client, Account, Databases,ID } from "appwrite";

const appwriteUrl = process.env.NEXT_PUBLIC_APPWRITE_URL;
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!appwriteUrl || !appwriteProjectId) {
  throw new Error("Missing required Appwrite environment variables");
}
const client = new Client()
   .setEndpoint(appwriteUrl) 
  .setProject(appwriteProjectId);

const account = new Account(client);
const databases = new Databases(client);
export {client,account,databases,ID};
