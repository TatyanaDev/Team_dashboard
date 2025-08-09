import { FC } from "react";
import { Employee } from "../types/types";

interface TeamGridProps {
  employees: Employee[];
}

const TeamGrid: FC<TeamGridProps> = ({ employees }) => (
  <div>
    {employees.map((employee) => (
      <div key={employee.id}>
        <img src={employee.avatarUrl} alt={employee.name} />
        <h2>{employee.name}</h2>
        <p>{employee.role}</p>
        <p>{employee.department}</p>
      </div>
    ))}
  </div>
);

export default TeamGrid;
