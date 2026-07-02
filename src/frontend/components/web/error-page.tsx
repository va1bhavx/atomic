interface ErrorPageProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const ErrorPage = ({
  title = "Uh oh! Something went wrong.",
  description = "Please try again later.",
  action,
}: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      {/*<img src="/assets/Resting.png" alt="error" width={300} height={300} />*/}
      <h1 className="text-xl">{title}</h1>
      <p className="text-sm text-neutral-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
