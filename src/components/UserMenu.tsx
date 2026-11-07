"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  // โหลดข้อมูล User และตรวจสอบว่าเป็น Admin หรือไม่
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      // แสดง Email
      if (user.email) {
        setEmail(user.email);
      }

      // ตรวจสอบ Role จากตาราง profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && profile?.role === "admin") {
        setIsAdmin(true);
      }
    }

    getUser();
  }, []);

  // Logout
  async function handleLogout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to logout:", error);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      {/* User Information */}
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-slate-900">
          {email || "Loading..."}
        </p>

        <p className="text-xs text-slate-500">
          {isAdmin ? "Administrator" : "DST Student"}
        </p>
      </div>

      {/* แสดงเฉพาะ Admin */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Admin Dashboard
        </button>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  );
}
