export default function Loading() {
  return (
    <div className="flex justify-center">
      <div className="max-w-content mx-4 space-y-8 py-8">
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          <div className="aspect-card h-full w-full animate-pulse rounded-3xl bg-neutral-200" />

          <div className="flex flex-col justify-between space-y-8 md:w-2/3">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-10 w-56 animate-pulse rounded-lg bg-neutral-200" />
              </div>

              <div className="space-y-2">
                <div className="h-7 w-full animate-pulse rounded-lg bg-neutral-200" />
                <div className="h-7 w-full animate-pulse rounded-lg bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
