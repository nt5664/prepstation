import { Suspense } from "react";
import LoaderMedium from "@/app/_components/LoaderMedium";
import ReportBrowser from "@/app/_components/moderation/ReportBrowser";
import { parseBool } from "@/app/_utils/bool";
import Filter from "@/app/_components/Filter";
import { REPORT_PAGE_SIZE } from "@/app/_utils/constants";
import RangeFilter from "@/app/_components/RangeFilter";
import { format, formatDate, parse } from "date-fns";

const HANDLED_VALUES = [
  { display: "No", value: "false" },
  { display: "Yes", value: "true" },
  { display: "All", value: "all" },
];

export const metadata = {
  title: "Reports",
};

export default async function ReportsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    handled?: string;
    range?: string;
    page?: string;
  }>;
}>) {
  const { handled, range, page } = await searchParams;
  const rangeArr = range?.split(";");
  const filter = {
    handled: parseBool(handled ?? null, false),
    range:
      rangeArr && rangeArr.length === 2
        ? {
            from: parse(rangeArr.at(0)!, "yyyy-MM-dd", new Date()),
            to: parse(rangeArr.at(1)!, "yyyy-MM-dd", new Date()),
          }
        : undefined,
    pagination: { page: page ? parseInt(page) : 1, size: REPORT_PAGE_SIZE },
  };

  return (
    <div className="mx-auto my-8 w-7/10">
      <h2 className="mb-4 text-2xl text-center">Reports</h2>

      <div className="flex flex-col border-2 rounded-lg border-cyan-700 bg-gray-600">
        <div className="flex gap-2 mx-2 mt-2">
          <Filter
            header="Resolved?"
            filterKey="handled"
            values={HANDLED_VALUES}
            defaultValue="false"
          />

          <RangeFilter
            header="Submission"
            filterKey="range"
            defaultValue={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        <Suspense key={`${handled}+${range}`} fallback={<LoaderMedium />}>
          <ReportBrowser filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
