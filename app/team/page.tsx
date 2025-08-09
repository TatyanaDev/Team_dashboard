"use client";

import { ChangeEvent, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import EmployeeCard from "../components/EmployeeCard";

const TeamPage = () => {
  const { employees, loading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

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

  return (
    <div>
      <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearchChange} />
      <select onChange={handleDepartmentChange}>
        <option value="All">All</option>
        <option value="Sales">Sales</option>
        <option value="Technical">Technical</option>
        <option value="Finance">Finance</option>
      </select>

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
