"use client";
import { ScreenLoader } from "@components/Loader";
import SideBar from "@components/SideBar";
import TopBar from "@components/TopBar";
import { selectAdminUser, setPermissions } from "@redux/slices/authSlice";
import { selectIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "src/hooks/UseSocket";
import { useSidebarState } from "src/utils/helper";
import "../../global.css";

function Layout({ children }: { children: React.ReactNode }) {
  const { socket, isConnected, error } = useSocket();
  const dispatch = useAppDispatch();
  const adminData = useSelector(selectAdminUser);

  const isLoading = useSelector(selectIsLoading);
  const isSidebarOpen = useSidebarState();

  useEffect(() => {
    if (!socket || !isConnected || !adminData?.user_id) return;
    socket.emit("join-room", { room: adminData?.user_id?.toLowerCase() });

    socket.emit("permission", { room: adminData?.user_id?.toLowerCase() });

    const handleUpdatedPermission = (data) => {
      dispatch(setPermissions(data));
    };

    socket.on("updatedPermission", handleUpdatedPermission);

    return () => {
      socket.off("updatedPermission");
      socket.emit("leave-room", { room: adminData?.user_id?.toLowerCase() });
    };
  }, [isConnected, socket, adminData?.user_id]);

  return (
    <section className="flex min-h-screen">
      <SideBar />
      <div
        className={`flex-1 bg-primary-200 ${
          isSidebarOpen
            ? "w-full lg:w-[calc(100%-16.67%)]"
            : "w-[calc(100%-76px)]"
        }`}
      >
        <TopBar />
        <div className="w-full flex-1">
          {isLoading && <ScreenLoader />}
          <div className="!p-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
