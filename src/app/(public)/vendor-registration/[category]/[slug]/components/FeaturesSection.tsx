interface FeatureProps {
  _id: string | number;
  title: string;
  description: string;
  icon: (props: any) => JSX.Element;
}

interface FeaturesSectionProps {
  features: FeatureProps[];
}

const FeatureCard = ({ feature }: { feature: FeatureProps }) => (
  <div className="rounded-lg bg-[linear-gradient(137.74deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] p-[1px] text-blue-400 shadow-[3px_3px_20px_0px_#0000001A] transition-all hover:shadow-none">
    <div className="flex h-full flex-col gap-4 rounded-[7px] bg-white px-6 py-8">
      {<feature.icon className="!size-6 md:!size-8" />}
      <p className="text-xl font-normal">{feature.title}</p>
    </div>
  </div>
);

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <div className="flex flex-col gap-24 px-12 sm:px-24">
      <div className="grid-col-1 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature?._id} feature={feature} />
        ))}
      </div>
    </div>
  );
}
