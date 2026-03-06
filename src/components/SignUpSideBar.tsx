import { CheckCircledLight, Logo } from "@assets/index";

const SignUpSideBar = ({ paragraphs }) => {
  return (
    <div className="flex-center h-full flex-col px-5 py-10 sm:px-10 md:px-5 lg:px-10">
      <div className="mr-auto sm:mb-10">
        <Logo className="h-32 w-32 sm:h-full sm:w-full" />
      </div>
      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="flex gap-3">
            <div>
              <CheckCircledLight />
            </div>
            <p className="text-14-600 text-primary-500">{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignUpSideBar;
