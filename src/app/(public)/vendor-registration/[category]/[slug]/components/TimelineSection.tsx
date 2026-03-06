interface TimelineItem {
  left: { title: string; description: string };
  right: { title: string; description: string };
}

interface TimelineSectionProps {
  data: TimelineItem[];
}

const Card = ({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className: string;
}) => (
  <div
    className={`flex h-auto !w-full !max-w-full flex-1 rounded-[10px] bg-[linear-gradient(137.74deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] p-[1px] text-blue-400 shadow-[0px_10px_20px_0px_#0000001A] md:!max-w-[385px] ${className}`}
  >
    <div className="flex !w-full flex-1 flex-col gap-2 rounded-[9px] bg-white p-4 md:gap-5 md:p-8">
      <p className="text-lg font-medium md:text-xl">{title}</p>
      <p className="text-sm font-normal text-grey-1100 md:text-base">
        {description}
      </p>
    </div>
  </div>
);

export default function TimelineSection({ data }: TimelineSectionProps) {
  return (
    <>
      <div className="hidden grid-rows-4 md:grid">
        {data.map((item, index) => (
          <div
            key={`row-${index}`}
            className="flex h-full w-full flex-row gap-10 xl:gap-16"
          >
            <Card
              key={`left-${index}`}
              title={item.left.title}
              description={item.left.description}
              className={index === data.length - 1 ? "mb-0" : "mb-8"}
            />

            <div
              key={`timeline-${index}`}
              className="relative h-full w-[1px] overflow-visible bg-blue-400"
            >
              <div className="size-7 -translate-x-[calc(50%-0.5px)] rounded-full bg-[linear-gradient(137.74deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)]" />
            </div>

            <Card
              key={`right-${index}`}
              title={item.right.title}
              description={item.right.description}
              className={index === data.length - 1 ? "mb-0" : "mb-8"}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-rows-8 md:hidden">
        {data
          .map((i) => [i.left, i.right])
          .flat()
          .map((item, index) => (
            <div
              key={`row-${index}`}
              className="flex h-full w-full flex-row gap-8"
            >
              <div
                key={`timeline-${index}`}
                className="relative h-full w-[1px] overflow-visible bg-blue-400"
              >
                <div className="size-6 -translate-x-[calc(50%-0.5px)] rounded-full bg-[linear-gradient(137.74deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)]" />
              </div>

              <Card
                key={`card-${index}`}
                title={item.title}
                description={item.description}
                className={
                  index === data.map((i) => [i.left, i.right]).flat().length - 1
                    ? "mb-0"
                    : "mb-8"
                }
              />
            </div>
          ))}
      </div>
    </>
  );
}
