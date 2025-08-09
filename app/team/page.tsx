"use client";

import { ChangeEvent, useState } from "react";
import { generateCSV } from "../services/csvExportService";
import EmployeeCard from "../components/EmployeeCard";
import { useEmployees } from "../hooks/useEmployees";
import { FilteredEmployee } from "../types/types";

const TeamPage = () => {
  const { employees, loading, error } = useEmployees();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => setSelectedDepartment(event.target.value);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesName = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment;
    return matchesName && matchesDepartment;
  });

  const handleExportClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formattedEmployees: FilteredEmployee[] = filteredEmployees.map(({ avatarUrl, ...rest }) => rest);
    generateCSV(formattedEmployees, "team_list.csv");
  };

  return (
    <div>
      <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearchChange} />
      <select onChange={handleDepartmentChange}>
        <option value="All">All</option>
        <option value="Sales">Sales</option>
        <option value="Technical">Technical</option>
        <option value="Finance">Finance</option>
      </select>

      <button onClick={handleExportClick}>Export to CSV</button>

      {filteredEmployees.length === 0 ? (
        <div>No employees found</div>
      ) : (
        <div>
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
