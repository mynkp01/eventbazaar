"use client";
import { apiHandler } from "@api/apiHandler";
import { DeleteIcon, PlusIcon } from "@assets/index";
import HideModel from "@components/HideModel";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const ArtistColumns = [
    {
      name: "Full Name",
      key: "full_name",
    },
    {
      name: "Create Date",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
    {
      name: "Update Date",
      key: "updatedAt",
      sort: "updatedAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },

    // { name: "Status", key: "status", sort: "" },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artist, setArtist] = useState(null);

  const [artistData, setArtistData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const sidebar = useSelector(selectAdminSideBar);
  const pathname = usePathname();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState({
    sort_type: "full_name",
    sort: 1,
  });

  const fetchArtistData = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.artist.list();

      if (status === 200 || status === 201) {
        setArtistData(data?.data);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      if (err?.error?.status === 406) {
        showToast("error", err.message);
        return router.back();
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const handleView = (artist) => {
    // router.push(`${ROUTES.admin.artist}/option?id=${artist._id}&view=1`);
    window.open(
      `${ROUTES.admin.artist}/option?id=${artist._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (artist) => {
    // router.push(`${ROUTES.admin.artist}/option?id=${artist._id}`);
    window.open(
      `${ROUTES.admin.artist}/option?id=${artist._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPage(1);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };
  const handleDelete = (artist) => {
    setArtist(artist);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchArtistData();
  }, []);
  const handleDeleteArtist = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.artist.delete(artist._id);
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchArtistData();
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
    } finally {
      dispatch(setIsLoading(false));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Artist</h1>
        <div className="flex items-center justify-end gap-2">
          {pagePermissions?.[PERMISSIONS.CREATE] ? (
            <button
              onClick={() =>
                window.open(
                  `${ROUTES.admin.artist}/option`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
            >
              <PlusIcon />
              <span className="text-body-xs ml-2">Add</span>
            </button>
          ) : null}
        </div>
      </div>
      <Table
        columns={ArtistColumns}
        data={artistData}
        actions={{
          onUpdate: handleUpdate,
          onView: handleView,
          showDelete: false,
          customAction: (artist) => (
            <>
              <button
                className="flex items-center justify-center rounded-md p-2 text-red-300"
                onClick={() => handleDelete(artist)}
              >
                <DeleteIcon className="h-5 w-5" />
              </button>
            </>
          ),
        }}
        totalPages={1}
        currentPage={page}
        handlePageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <HideModel
        open={isModalOpen}
        heading={`Are you sure want to delete this ?`}
        btnTitle={"Delete"}
        setOpen={setIsModalOpen}
        func={handleDeleteArtist}
      />
    </div>
  );
};

export default Page;
