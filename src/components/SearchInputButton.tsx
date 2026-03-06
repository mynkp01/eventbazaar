import { SearchIcon } from "@assets/index";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface SearchInputButtonInterface {
  search: string;
  setSearch: (value: string) => void;
  searchMessage?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

const SearchInputButton = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    SearchInputButtonInterface,
) => {
  const {
    search,
    setSearch,
    searchMessage,
    autoFocus = false,
    maxLength = 50,
    ...restProps
  } = props;

  return (
    <>
      {/* <div className="relative flex">
        <input
          type="text"
          placeholder={searchMessage || "Search message"}
          value={search}
          className="mx-1 w-full rounded-xl bg-primary-200 px-8 py-2 font-semibold !text-primary-800 outline-none placeholder:text-[15px] placeholder:font-medium placeholder:leading-[24px] placeholder:text-primary-400 sm:mx-2 sm:px-10 sm:py-3"
          maxLength={maxLength}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={autoFocus}
        />
        <div className="absolute left-4 top-2 sm:top-3">
          <SeachIcon className="w-4/5 sm:w-full" />
        </div>
      </div> */}

      <div className="relative flex w-full items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-4">
          <SearchIcon className="size-5 min-h-5 min-w-5 text-primary-400" />
        </div>

        <input
          type="text"
          placeholder={searchMessage || "Search message"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={maxLength}
          {...restProps}
          className={`w-full rounded-xl bg-primary-200 py-2 pl-10 pr-4 font-semibold text-primary-800 outline-none placeholder:text-[15px] placeholder:font-medium placeholder:leading-[24px] placeholder:text-primary-400 sm:py-3 sm:pl-12 ${props.className}`}
        />
      </div>
    </>
  );
};

export default SearchInputButton;
