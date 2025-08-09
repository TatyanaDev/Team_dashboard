import { useState, useEffect } from "react";
import { Employee } from "../types/types";

export const useEmployees = (id?: string) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEmployees = async () => {
      const storedEmployees = localStorage.getItem("employees");

      if (storedEmployees) {
        const employeesData = JSON.parse(storedEmployees) as Employee[];
        if (id) {
          const foundEmployee = employeesData.find((emp) => emp.id === id);
          setEmployee(foundEmployee || null);
        } else {
          setEmployees(employeesData);
        }

        setLoading(false);
      } else {
        setTimeout(async () => {
          try {
            const mockData = await import("../../public/mockData.json");
            const employeesData = mockData.employees as Employee[];

            if (id) {
              const foundEmployee = employeesData.find((emp) => emp.id === id);
              setEmployee(foundEmployee || null);
            } else {
              setEmployees(employeesData);
            }

            localStorage.setItem("employees", JSON.stringify(employeesData));
            setLoading(false);
          } catch (error) {
            console.error(error);
            setError("Error fetching employees");
            setLoading(false);
          }
        }, 1000);
      }
    };

    loadEmployees();
  }, [id]);

  const updateEmployee = (id: string, updatedData: Partial<Employee>) =>
    setEmployees((prevEmployees) => {
      const updatedEmployees = prevEmployees.map((employee) => (employee.id === id ? { ...employee, ...updatedData } : employee));
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      return updatedEmployees;
    });

  return { employees, employee, loading, error, updateEmployee };
};
