import MessagesPage from "@/features/messages/components/MessagesPage";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  await getSession();

  return <MessagesPage />;
}
