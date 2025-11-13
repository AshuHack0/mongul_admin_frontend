import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/dashboard.module.css";
import { NavLink } from "react-router-dom";
import { Divider } from "@mui/material";

const navItems = [
  { label: "Dashboard", icon: "", to: "/dashboard" },
  { label: "Mentor Applications", icon: "", to: "/mentor-applications" },
  { label: "Mentors", icon: "", to: "/mentors" },
  { label: "Categories", icon: "", to: "/categories" },
];

const SideBarLayout = ({ header, children, className }) => {
  const rootClassName = className
    ? `${styles.dashboard} ${className}`
    : styles.dashboard;

  return (
    <div className={rootClassName}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <nav className={styles.navList}>
            {navItems.map((item) => (
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
          </nav>

          <Divider className={styles.sidebarDivider} />
        </div>
      </aside>
      <div className={styles.contentArea}>
        {header && <header className={styles.header}>{header}</header>}
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
