export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const PAGINATION_CLASSNAMES = {
  wrapper:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-grid-border bg-card text-sm",
  infoWrapper: "hidden md:flex items-center text-muted-foreground",
  controlsWrapper:
    "flex flex-wrap items-center justify-center gap-1 overflow-x-auto max-w-full",
  rowsPerPageWrapper:
    "flex items-center justify-center sm:justify-end gap-2 text-muted-foreground whitespace-nowrap",
  button: "h-8 w-8 p-0",
  mobilePageIndicator: "block md:hidden text-xs text-muted-foreground ml-2 whitespace-nowrap",
  ellipsis: "px-2 text-muted-foreground",
};
