import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="ml-auto h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-24 px-4">
          <div className="flex items-center justify-between py-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="flex items-center justify-between py-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[70px]" />
        <Skeleton className="h-8 w-[70px]" />
      </div>
    </div>
  );
}
