import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "./Loader";

const InfiniteScrollWrapper = ({
  dataLength,
  callNext,
  hasMore,
  children,
  parentDivId = "infinite_scroll",
  className = "",
  inverse = false,
}) => {
  if (dataLength === 0 && hasMore) return <Loader />;

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={callNext}
      hasMore={hasMore}
      loader={<Loader />}
      className={`!overflow-hidden ${className}`}
      scrollableTarget={parentDivId}
      inverse={inverse}
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollWrapper;
