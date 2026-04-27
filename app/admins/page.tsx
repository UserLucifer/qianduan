import { redirect } from "next/navigation";

export default function AdminsIndexPage() {
  redirect("/admins/dashboard");
}
