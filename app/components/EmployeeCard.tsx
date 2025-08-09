import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Employee } from "../types/types";

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: FC<EmployeeCardProps> = ({ employee }) => (
  <div>
    <Image src={employee.avatarUrl} alt={employee.name} width={150} height={150} priority />
    <h2>{employee.name}</h2>
    <p>{employee.role}</p>
    <p>{employee.department}</p>
    <p>{employee.status}</p>
    <Link href={`/team/${employee.id}`}>View Profile</Link>
  </div>
);

export default EmployeeCard;
