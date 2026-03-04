"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import clsx from "clsx";
import DisplayGrid from "@/app/_components/DisplayGrid";
import Button from "@/app/_components/primitives/Button";
import LoaderMedium from "@/app/_components/LoaderMedium";
import { getUserActivities } from "@/app/_lib/actions";
import { ACTIVITY_PAGE_KEY, ACTIVITY_PAGE_SIZE } from "@/app/_utils/constants";
import PageNavigation from "@/app/_components/PageNavigation";
import { ActivityData } from "@/app/_types/ActivityData";
import ActivityViewer from "@/app/_components/moderation/ActivityViewer";

export default function UserActivityView() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityData[]>([]); //FIX
  const [activityToShow, setActivityToShow] = useState<ActivityData | null>(
    null,
  );
  const { userId } = useParams();
  const page = useSearchParams().get(ACTIVITY_PAGE_KEY) ?? "1";

  useEffect(() => {
    async function fetchActivities() {
      setIsLoading(true);
      if (!userId || Array.isArray(userId)) {
        setIsLoading(false);
        return;
      }

      setActivities(await getUserActivities(userId, parseInt(page)));
      setIsLoading(false);
    }

    fetchActivities();
  }, [userId, page, setIsLoading, setActivities]);

  function handleClose() {
    setActivityToShow(null);
  }

  return isLoading ? (
    <LoaderMedium />
  ) : (
    <>
      <div className="flex flex-col justify-between gap-1 h-full">
        <DisplayGrid
          className={clsx(
            "overflow-auto",
            activities.length >= 5
              ? "p-1 border-2 rounded-sm border-cyan-600"
              : "",
          )}
          columnDefinition="1fr"
          renderRows={() =>
            activities.slice(0, ACTIVITY_PAGE_SIZE).map((x) => (
              <Button
                key={x.id}
                className="border-2 rounded-md text-center align-middle border-cyan-600 bg-gray-700"
                onClick={() => setActivityToShow(x)}
              >
                <div className="flex justify-between">
                  <div>
                    {format(
                      new TZDate(x.createdAt, "UTC"),
                      "dd MMM yyyy HH:mm:ss '(UTC)'",
                    )}
                  </div>
                  <div className="uppercase">
                    {x.affects} &gt; {x.payload.action}
                  </div>
                </div>
              </Button>
            ))
          }
        />

        <PageNavigation
          customKey={ACTIVITY_PAGE_KEY}
          lastPage={activities.length <= ACTIVITY_PAGE_SIZE}
        />
      </div>
      <ActivityViewer activityToShow={activityToShow} onClose={handleClose} />
    </>
  );
}
