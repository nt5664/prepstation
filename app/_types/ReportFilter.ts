import { QueryRange } from "@/app/_types/QueryRange";
import { PaginationRange } from "@/app/_types/PaginationRange";

export type ReportFilter = {
  handled?: boolean;
  pagination?: PaginationRange;
  range?: QueryRange;
};
