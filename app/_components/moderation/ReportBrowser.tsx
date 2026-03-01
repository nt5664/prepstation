import { ReportFilter } from "@/app/_types/ReportFilter";
import { getReports } from "@/app/_lib/data/report-service";
import { getPrefTimeFormat } from "@/app/_lib/pref";
import { getTimeFormatString } from "@/app/_utils/prefs";
import DisplayGrid from "@/app/_components/DisplayGrid";
import ReportRow from "@/app/_components/moderation/ReportRow";
import PageNavigation from "@/app/_components/PageNavigation";
import { REPORT_PAGE_SIZE } from "@/app/_utils/constants";

export default async function ReportBrowser({
  filter,
}: Readonly<{ filter: ReportFilter }>) {
  const [reports, timeFormat] = await Promise.all([
    getReports(filter),
    getPrefTimeFormat(),
  ]);
  const timeFormatString = getTimeFormatString(timeFormat);
  const numReports = reports.length;
  const { pageNum, pageSize } = {
    pageNum: filter.pagination!.page,
    pageSize: filter.pagination!.size,
  };
  const lastPage = reports.length <= REPORT_PAGE_SIZE;

  return (
    <div className="m-2">
      <DisplayGrid
        className="pb-1 w-auto max-h-full border-2 rounded-md border-sky-600"
        renderHeader={() => (
          <div className="grid grid-cols-7 col-span-full px-1 bg-sky-600">
            {[
              "Submitted",
              "Reporter",
              "Event",
              "Status",
              "Handled at",
              "Handler",
              "Actions",
            ].map((x) => (
              <div key={x} className="text-center text-lg font-semibold">
                {x}
              </div>
            ))}
          </div>
        )}
        columnDefinition="1fr"
        renderRows={() => (
          <div className="overflow-y-auto px-1">
            {reports.length ? (
              reports
                .splice(0, REPORT_PAGE_SIZE)
                .map((x) => (
                  <ReportRow
                    key={x.id}
                    timeFormat={timeFormatString}
                    data={x}
                  />
                ))
            ) : (
              <div className="col-span-full text-center italic text-gray-300">
                No reports to show
              </div>
            )}
          </div>
        )}
      />

      <div className="flex justify-between mt-2 items-center">
        <div>
          Displaying entries {(pageNum - 1) * pageSize + 1}-
          {(pageNum - 1) * pageSize +
            Math.min(Math.max(numReports, 0), REPORT_PAGE_SIZE)}
        </div>

        <PageNavigation lastPage={lastPage} />
      </div>
    </div>
  );
}
