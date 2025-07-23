type SortDirection = 'asc' | 'desc';

interface SortModel {
  field: string;
  direction: SortDirection;
}

export function sortData(data: any[], sortModel: SortModel[]): any[] {
  
  if (!sortModel.length) return data;

  const sorted = [...data];

  sorted.sort((a, b) => {
    for (let { field, direction } of sortModel) {
      let aVal = a[field];
      let bVal = b[field];

      switch (field) {
        case 'joinDate': {
          const parseDate = (dateStr: string) => {
            if (!dateStr) return null;
            const [month, day, year] = dateStr.split('/').map(Number);
            if (!month || !day || !year) return null;
            return new Date(year, month - 1, day);
          };
      
          aVal = parseDate(aVal ?? '');
          bVal = parseDate(bVal ?? '');
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
          aVal = aVal?.toString().toLowerCase() ?? '';
          bVal = bVal?.toString().toLowerCase() ?? '';
          break;
        }
      
        default: {
          aVal = aVal ?? '';
          bVal = bVal ?? '';
        }
      }
      

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }

    return 0; // If equal, go to next sort or preserve order
  });

  return sorted;
}
