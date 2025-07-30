import { User } from "../api.types";
import { Column } from "../grid.types";

export interface EditRowModalProps {
    isOpen: boolean;
    onClose: () => void;
    columns: Column[];
    row: User;
    editRowData: User | undefined;
    setEditRowData: React.Dispatch<React.SetStateAction<User | undefined>>;
    onSubmit: (updated: User) => void;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  }

  export interface  ViewRowModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | undefined;
  }
  