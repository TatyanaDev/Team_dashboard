import { FilteredEmployee } from "../types/types";

export const generateCSV = (data: FilteredEmployee[], filename: string) => {
  // Array to store the rows of the CSV
  const csvRows: string[] = [];

  // Get the headers (keys of the employee object)
  const headers = Object.keys(data[0]) as (keyof FilteredEmployee)[];

  // Add headers as the first row in the CSV
  csvRows.push(headers.join(","));

  // Iterate over each row (each employee)
  for (const row of data) {
    // For each row, map the headers to get the values
    const values = headers.map((header) => {
      const value = row[header]; // Get the value for the corresponding field
      const formattedValue = value === undefined ? "" : value; // If value is undefined, replace it with an empty string
      return `"${String(formattedValue).replace(/"/g, '""')}"`; // Escape double quotes for CSV formatting
    });

    // Add the values as a new row in the CSV (values joined with commas)
    csvRows.push(values.join(","));
  }

  // Create a Blob with the CSV data (this will allow us to download it as a file)
  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });

  // Create a download link using the Blob URL
  const url = window.URL.createObjectURL(csvData);

  // Create an anchor link element
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();

  // Revoke the object URL after the download has started to free up memory
  window.URL.revokeObjectURL(url);
};
