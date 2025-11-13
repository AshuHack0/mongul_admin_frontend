import React from "react";
import { useSelector } from "react-redux";
import SideBarLayout from "../layout/SideBarLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid";

const stats = [
  {
    label: "Active Mentors",
    value: "128",
    change: "+12%",
    trend: "up",
    description: "Mentors helping mentees this week",
  },
  {
    label: "Active Mentees",
    value: "2,450",
    change: "+6%",
    trend: "up",
    description: "Users who engaged in learning",
  },
  {
    label: "Pending Sessions",
    value: "34",
    change: "-3%",
    trend: "down",
    description: "Sessions awaiting mentor confirmation",
  },
  {
    label: "Avg. Session Rating",
    value: "4.7",
    change: "+0.2",
    trend: "up",
    description: "Out of 5 across all sessions",
  },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const header = <DashboardHeader userName={user?.fullName} />;

  return (
    <SideBarLayout header={header}>
      <DashboardStatsGrid stats={stats} />
    </SideBarLayout>
  );
};

export default Dashboard;
