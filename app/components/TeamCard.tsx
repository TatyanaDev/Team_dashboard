import { useRouter } from "next/navigation";
import { FC } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Employee } from "../types/types";

interface TeamCardProps {
  employee: Employee;
}

const TeamCard: FC<TeamCardProps> = ({ employee }) => {
  const router = useRouter();

  const handleClick = () => router.push(`/team/${employee.id}`);

  return (
    <Card onClick={handleClick} style={{ cursor: "pointer", margin: "10px", width: "200px" }}>
      <img src={employee.avatarUrl} alt={employee.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <CardContent>
        <Typography variant="h6">{employee.name}</Typography>
        <Typography variant="body2">{employee.role}</Typography>
        <Typography variant="body2">{employee.department}</Typography>
        <Typography variant="body2" color={employee.status === "active" ? "green" : "red"}>
          {employee.status === "active" ? "Active" : "Inactive"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
