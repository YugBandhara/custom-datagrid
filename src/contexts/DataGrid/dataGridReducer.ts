// contexts/data-grid/dataGridReducer.ts
import { GridState, Column, SortModel } from "@/types/grid.types";
import { DataGridAction } from "./dataGridTypes";

export const initialGridState: GridState = {
  data: [],
  columns: [],
  density: "standard",
  visibleColumns: [],
  pinnedColumns: { left: [], right: [] },
  sortModel: [],
  filterModel: {},
  selectedRows: new Set(),
  pagination: { page: 0, pageSize: 25 },
  loading: false,
  error: null,
  groupOrder: [],
};

export function dataGridReducer(state: GridState, action: DataGridAction): GridState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
      case "REORDER_COLUMN": {
        const { activeId, overId } = action.payload;
      
        const activeIndex = state.columns.findIndex((col) => col.field === activeId);
        const overIndex = state.columns.findIndex((col) => col.field === overId);
      
        if (activeIndex === -1 || overIndex === -1) return state;
      
        const updatedColumns = [...state.columns];
        const [movedCol] = updatedColumns.splice(activeIndex, 1);
      
        const overCol = state.columns[overIndex];
        const destinationGroup = overCol.group ?? undefined;
    
    
        movedCol.group = destinationGroup;
    
        if (destinationGroup) {
          const pinnedInGroup = state.columns.find(
            (col) => col.group === destinationGroup && col.pinned
          );
      
          if (pinnedInGroup) {
            movedCol.pinned = pinnedInGroup.pinned; 
          }
        }
      

        updatedColumns.splice(overIndex, 0, movedCol);
      
 
        const usedGroups = new Set(
          updatedColumns.filter((col) => col.group).map((col) => col.group!)
        );
        const updatedGroupOrder = state.groupOrder.filter((g) => usedGroups.has(g));
      
        return {
          ...state,
          columns: updatedColumns,
          pinnedColumns: {
            left: updatedColumns.filter((col) => col.pinned === "left").map((c) => c.field),
            right: updatedColumns.filter((col) => col.pinned === "right").map((c) => c.field),
          },
          groupOrder: updatedGroupOrder,
        };
      }

    case 'SET_GROUP_ORDER':
      return { ...state, groupOrder: action.payload };

    case 'TOGGLE_COLUMN_VISIBILITY':
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.field === action.payload
            ? { ...col, visible: !col.visible }
            : col
        ),
      };
      case "TOGGLE_SORT": {
        const field = action.payload;
        const multi = action.multi ?? false;
      
        const existing = state.sortModel.find((s) => s.field === field);
      
        let newSortModel: SortModel[];
      
        if (multi) {

          newSortModel = [...state.sortModel];
        } else {

          newSortModel = state.sortModel.filter((s) => s.field === field);
        }
      
        if (!existing) {

          newSortModel.push({ field, direction: "asc" });
        } else if (existing.direction === "asc") {

          newSortModel = newSortModel.map((s) =>
            s.field === field ? { ...s, direction: "desc" } : s
          );
        } else {

          newSortModel = newSortModel.filter((s) => s.field !== field);
        }
      
        return { ...state, sortModel: newSortModel };
      }
      

    case 'SET_FILTER_MODEL':
      return { ...state, filterModel: action.payload };

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pagination: { page: 0, pageSize: action.payload },
      };
      case 'PIN_COLUMN': {
        const { field, side } = action.payload;
      
        const targetCol = state.columns.find((col) => col.field === field);
        if (!targetCol) return state;
      
        const group = targetCol.group;
      
        const updatedColumns = state.columns.map((col) => {

          if (group && col.group === group) {
            if (side === null && col.field === field) {


              return { ...col, group: null, pinned: null };
            }
      
            return { ...col, pinned: side };
          }
      
      
          if (!group && col.field === field) {
            return { ...col, pinned: side };
          }
      
          return col;
        });
      
        return {
          ...state,
          columns: updatedColumns,
          pinnedColumns: {
            left: updatedColumns.filter((col) => col.pinned === 'left').map((c) => c.field),
            right: updatedColumns.filter((col) => col.pinned === 'right').map((c) => c.field),
          },
        };
      }
      
      
      

    case 'UPDATE_COLUMN_WIDTH': {
      const { field, width } = action.payload;
      const updatedColumns = state.columns.map((col) =>
        col.field === field ? { ...col, width } : col
      );
      return {
        ...state,
        columns: updatedColumns,
      };
    }

    case 'SET_DENSITY':
      return { ...state, density: action.payload };

    case 'UPDATE_ROW': {
      const updatedRow = action.payload;
      console.log(updatedRow)
      const updatedData = state.data.map((row) =>
        row.id === updatedRow.id ? updatedRow : row
      );
      console.log(updatedData, "updatedData")
      return { ...state, data: updatedData };
    }
    case "DELETE_ROW":
      return {
        ...state,
        data: state.data.filter((row) => row.id !== action.payload),
      };
      case "UPDATE_COLUMN_GROUP": {
        const { field, group } = action.payload;
      
        const updatedColumns = state.columns.map((col) => {
          if (col.field !== field) return col;
      

      
          return { ...col, group };
        });


        const activeGroups = new Set(updatedColumns.filter(c => c.group).map(c => c.group!));
        const updatedGroupOrder = [...state.groupOrder.filter(g => activeGroups.has(g))];
        if (group && !updatedGroupOrder.includes(group)) {
          updatedGroupOrder.push(group);
        }
      
        
        const grouped: Record<string, Column[]> = {};
        const ungrouped: Column[] = [];
      
        for (const col of updatedColumns) {
          if (col.group) {
            if (!grouped[col.group]) grouped[col.group] = [];
            grouped[col.group].push(col);
          } else {
            ungrouped.push(col);
          }
        }
      
        const orderedGroups = updatedGroupOrder.filter((g) => grouped[g]);
        const reorderedColumns = [
          ...orderedGroups.flatMap((g) => grouped[g]),
          ...ungrouped,
        ];
      
        return {
          ...state,
          columns: reorderedColumns,
          pinnedColumns: {
            left: reorderedColumns.filter((col) => col.pinned === "left").map((c) => c.field),
            right: reorderedColumns.filter((col) => col.pinned === "right").map((c) => c.field),
          },
          groupOrder: updatedGroupOrder,
        };
      }
      
      
      
      
    default:
      return state;
  }
}