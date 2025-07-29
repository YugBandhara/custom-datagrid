import { User } from "@/types/api.types";

type SortDirection = 'asc' | 'desc';

interface SortModel {
  field: string;
  direction: SortDirection;
}

export function sortData(data: User[], sortModel: SortModel[]): User[] {
  if (!sortModel.length) return data;

  const sorted = [...data];

  sorted.sort((a, b) => {
    for (const { field, direction } of sortModel) {
      let aVal: string | number | Date | null | undefined = a[field as keyof User];
      let bVal: string | number | Date | null | undefined = b[field as keyof User];
      

      switch (field) {
        case 'joinDate': {
          const parseDate = (dateStr: string) => {
            if (!dateStr) return null;
            const [month, day, year] = dateStr.split('/').map(Number);
            if (!month || !day || !year) return null;
            return new Date(year, month - 1, day);
          };
          aVal = parseDate(aVal as string);
          bVal = parseDate(bVal as string);
          break;
        }

        case 'salary':
        case 'id': {
          aVal = Number(aVal);
          bVal = Number(bVal);
          break;
        }

        case 'status': {
          const statusOrder: Record<string, number> = { active: 2, inactive: 1 };
          const aStatus = (aVal ?? '').toString().toLowerCase();
          const bStatus = (bVal ?? '').toString().toLowerCase();
          aVal = statusOrder[aStatus] ?? 0;
          bVal = statusOrder[bStatus] ?? 0;
          break;
        }

        case 'name':
        case 'email':
        case 'role':
        case 'department': {
          aVal = (aVal ?? '').toString().toLowerCase();
          bVal = (bVal ?? '').toString().toLowerCase();
          break;
        }

        default: {
          aVal = aVal ?? '';
          bVal = bVal ?? '';
        }
      }
      if (aVal === null || bVal === null) {
        if (aVal === null && bVal === null) continue;
        return aVal === null ? (direction === 'asc' ? -1 : 1) : (direction === 'asc' ? 1 : -1);
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      
    }

    return 0;
  });

  return sorted;
}
