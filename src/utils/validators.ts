export const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "name":
      case "role":
      case "department":
        return value.trim() ? null : "This field is required.";
  
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : "Invalid email format.";
  
      case "salary":
        return /^\d+$/.test(value) && parseInt(value) > 0
          ? null
          : "Salary must be a positive number.";
  
      case "joinDate":
        return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)
          ? null
          : "Date must be in MM/DD/YYYY format.";
  
      case "status":
        return ["active", "inactive"].includes(value.toLowerCase())
          ? null
          : "Status must be 'active' or 'inactive'.";
  
      case "avatar":
        return value.startsWith("http")
          ? null
          : "Must be a valid URL.";
  
      default:
        return null; // For other fields, no validation for now
    }
  };
  