import React from "react";
import { Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const DashboardStatsGrid = ({ stats }) => {
  return (
    <Grid container spacing={3} className={styles.statsGrid}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className={styles.statCard} elevation={0}>
            <CardContent>
              <Typography variant="overline" className={styles.cardLabel}>
                {stat.label}
              </Typography>
              <Typography variant="h4" component="p" className={styles.cardValue}>
                {stat.value}
              </Typography>
              <Chip
                size="small"
                label={stat.change}
                color={stat.trend === "up" ? "success" : "error"}
                className={styles.cardChip}
              />
              <Typography variant="body2" className={styles.cardDescription}>
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStatsGrid;
