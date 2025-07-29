import { sortData } from "@/utils/gridHelpers";
import { SortModel } from "@/types/grid.types"; // Optional: Define this type yourself

export const getFilteredData = (
  data: any[],
  search: string,
  filterModel: Record<string, string>,
  sortModel: SortModel[]
): any[] => {
  const searchLower = search.toLowerCase();

  const filtered = data.filter((row) => {
    const matchesSearch = Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(searchLower)
    );

    const matchesFilters = Object.entries(filterModel).every(([field, value]) => {
      if (!value) return true;

      const fieldVal = row[field];

      if (typeof fieldVal === "undefined" || fieldVal === null) return false;

      if (field === "status") {
        return fieldVal.toString().toLowerCase() === value.toLowerCase();
      }

      return fieldVal.toString().toLowerCase().includes(value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  return sortData(filtered, sortModel);
};
