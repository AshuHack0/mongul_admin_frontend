import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/dashboard.module.css";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { logoutAsync } from "../store/thunks/authThunks";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: <DashboardOutlinedIcon fontSize="small" />, to: "/dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Mentor Applications", icon: <AssignmentOutlinedIcon fontSize="small" />, to: "/mentor-applications" },
      { label: "Mentors", icon: <PeopleOutlinedIcon fontSize="small" />, to: "/mentors" },
      { label: "Categories", icon: <CategoryOutlinedIcon fontSize="small" />, to: "/categories" },
      { label: "Category Requests", icon: <SwapHorizOutlinedIcon fontSize="small" />, to: "/category-change-requests" },
      { label: "Surveys", icon: <PollOutlinedIcon fontSize="small" />, to: "/surveys" },
    ],
  },
  {
    label: "Blog",
    items: [
      { label: "Blog", icon: <AssignmentOutlinedIcon fontSize="small" />, to: "/blog" },
    ],
  },
];

const getInitials = (name) => {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatHeaderDate = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

const SideBarLayout = ({ header, children, className }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const initials = getInitials(user?.fullName);

  const rootClassName = className
    ? `${styles.dashboard} ${className}`
    : styles.dashboard;

  return (
    <div className={rootClassName}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandIconWrap}>
              <AutoAwesomeIcon style={{ fontSize: 14, color: "#ffffff" }} />
            </div>
            <span className={styles.brandName}>Mongul</span>
          </div>

          {/* Navigation */}
          <nav className={styles.navList}>
            {navSections.map((section) => (
              <React.Fragment key={section.label}>
                <span className={styles.navSection}>{section.label}</span>
                {section.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.navLink} ${styles.activeNavLink}`
                        : styles.navLink
                    }
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </React.Fragment>
            ))}
          </nav>

          {/* User footer */}
          <div className={styles.sidebarFooter}>
            <Tooltip title="Logout" placement="top-start">
              <button
                className={styles.userProfileBtn}
                onClick={() => dispatch(logoutAsync())}
              >
                <div className={styles.sidebarAvatar}>{initials}</div>
                <div className={styles.sidebarUserInfo}>
                  <div className={styles.sidebarUserName}>
                    {user?.fullName || "Admin"}
                  </div>
                  <div className={styles.sidebarUserRole}>Administrator</div>
                </div>
                <LogoutOutlinedIcon className={styles.logoutIcon} />
              </button>
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className={styles.contentArea}>
        <header className={styles.header}>
          <div className={styles.headerBar}>
            <div className={styles.headerLeft}>{header}</div>
            <div className={styles.headerRight}>
              <span className={styles.headerDate}>{formatHeaderDate()}</span>
              <Tooltip title="Notifications">
                <div className={styles.iconBtn}>
                  <NotificationsNoneOutlinedIcon style={{ fontSize: 18 }} />
                </div>
              </Tooltip>
              <Tooltip title={user?.fullName || "Admin"}>
                <div className={styles.headerAvatar}>{initials}</div>
              </Tooltip>
            </div>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

SideBarLayout.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SideBarLayout.defaultProps = {
  header: null,
  className: undefined,
};

export default SideBarLayout;
