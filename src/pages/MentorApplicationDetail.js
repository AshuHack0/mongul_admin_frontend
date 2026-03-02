import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import SideBarLayout from "../layout/SideBarLayout";
import {
  approveMentorApplicationThunk,
  fetchMentorApplicationByIdThunk,
  rejectMentorApplicationThunk,
} from "../store/thunks/mentorApplicationsThunks";

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (_error) {
    return "—";
  }
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    const joined = value
      .filter((item) => item !== null && item !== undefined && `${item}`.trim())
      .join(", ");
    return joined;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
};

const isUrl = (value) => /^https?:\/\//i.test(value);

const collectDocumentLinks = (application) => {
  if (!application) return [];

  const links = [];
  const seen = new Set();
  const pushLink = (label, url) => {
    if (!url || typeof url !== "string") return;
    const trimmedUrl = url.trim();
    if (!trimmedUrl || seen.has(trimmedUrl)) return;
    // Only allow http/https URLs to prevent javascript: URL injection
    if (!isUrl(trimmedUrl)) return;
    links.push({ label, url: trimmedUrl });
    seen.add(trimmedUrl);
  };

  pushLink("Resume", application.resumeUrl);
  pushLink("Resume", application.resume);
  pushLink("Curriculum Vitae", application.cvUrl);
  pushLink("Identification Document", application.idDocumentUrl);
  pushLink("Identification Document", application.identityDocumentUrl);
  pushLink("Portfolio", application.portfolioDocumentUrl);
  pushLink("Certificate", application.certificateUrl);
  pushLink("Additional Document", application.document);

  if (Array.isArray(application.documentUrls)) {
    application.documentUrls.forEach((url, index) => {
      pushLink(`Document ${index + 1}`, url);
    });
  }

  if (Array.isArray(application.documents)) {
    application.documents.forEach((doc, index) => {
      if (typeof doc === "string") {
        pushLink(`Document ${index + 1}`, doc);
      } else if (doc && typeof doc === "object") {
        const label =
          doc.label ||
          doc.name ||
          doc.type ||
          doc.title ||
          `Document ${index + 1}`;
        pushLink(label, doc.url || doc.link);
      }
    });
  }

  return links;
};

const getDocumentType = (url) => {
  if (!url || typeof url !== "string") return "unknown";
  const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();

  if (/\.(png|jpe?g|gif|webp|svg|bmp|tiff?)$/.test(cleanUrl)) return "image";
  if (cleanUrl.endsWith(".pdf")) return "pdf";

  return "unknown";
};

const getDocumentIcon = (type) => {
  switch (type) {
    case "image":
      return <ImageOutlinedIcon fontSize="small" />;
    case "pdf":
      return <PictureAsPdfRoundedIcon fontSize="small" />;
    default:
      return <InsertDriveFileOutlinedIcon fontSize="small" />;
  }
};

const getDocumentTypeLabel = (type) => {
  switch (type) {
    case "image":
      return "Image";
    case "pdf":
      return "PDF";
    default:
      return "File";
  }
};

const getStatusChipColor = (status) => {
  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "applied":
    case "pending":
    case "review":
    case "in review":
      return "warning";
    case "upgrade_requested":
      return "info";
    default:
      return "default";
  }
};

const MentorApplicationDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const header = useMemo(
    () => (
      <Stack spacing={0.5}>
        <Typography variant="h5">Mentor Application</Typography>
        <Typography variant="body2" color="text.secondary">
          Review the full application details and supporting documents.
        </Typography>
      </Stack>
    ),
    []
  );

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await dispatch(
        fetchMentorApplicationByIdThunk(applicationId)
      ).unwrap();
      setApplication(data);
    } catch (message) {
      setApplication(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [applicationId, dispatch]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleApprove = async () => {
    if (!applicationId) return;

    setApproving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(
        approveMentorApplicationThunk(applicationId)
      ).unwrap();
      setSuccessMessage(message);
      await fetchApplication();
    } catch (message) {
      setError(message);
    } finally {
      setApproving(false);
    }
  };

  const handleOpenRejectDialog = () => {
    setRejectReason("");
    setError(null);
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    if (rejecting) return;
    setRejectDialogOpen(false);
  };

  const handleReject = async () => {
    if (!applicationId) return;

    setRejecting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(
        rejectMentorApplicationThunk({
          applicationId,
          reason: rejectReason?.trim() || undefined,
        })
      ).unwrap();
      setSuccessMessage(message);
      setRejectDialogOpen(false);
      await fetchApplication();
    } catch (message) {
      setError(message);
    } finally {
      setRejecting(false);
    }
  };

  const infoItems = useMemo(() => {
    if (!application) return [];

    return [
      { label: "Full Name", value: application.fullName },
      { label: "Email", value: application.email },
      { label: "Phone", value: application.phone },
      { label: "Mentor Type", value: application.mentorType },
      { label: "Experience", value: application.experience },
      { label: "Current Role", value: application.currentRole },
      { label: "Company", value: application.company },
      { label: "Highest Qualification", value: application.highestQualification },
      {
        label: "Fields of Expertise",
        value: application.fieldsOfExpertise ?? application.expertiseAreas,
      },
      { label: "Skills", value: application.skills },
      { label: "Languages", value: application.languages },
      { label: "Availability", value: application.availability },
      { label: "Country", value: application.country },
      { label: "City", value: application.city },
      { label: "Time Zone", value: application.timeZone },
      { label: "LinkedIn", value: application.linkedInUrl },
      { label: "Portfolio", value: application.portfolioUrl },
      { label: "Website", value: application.website },
      { label: "Status", value: application.mentorApplicationStatus },
      { label: "Applied On", value: application.createdAt },
    ]
      .map((item) => ({
        ...item,
        normalized:
          item.label === "Applied On"
            ? formatDateTime(item.value)
            : normalizeValue(item.value),
      }))
      .filter((item) => item.normalized && item.normalized !== "—");
  }, [application]);

  const documentLinks = useMemo(
    () => collectDocumentLinks(application),
    [application]
  );

  const bioText = normalizeValue(application?.bio || application?.about);
  const motivationText = normalizeValue(
    application?.motivation || application?.statement
  );

  const normalizedStatus = normalizeValue(application?.mentorApplicationStatus).toLowerCase();
  const isApproved = normalizedStatus === "approved";
  const isRejected = normalizedStatus === "rejected";
  const isUpgradeRequest = application?.mentorApplicationStatus === "upgrade_requested";

  const renderDocumentPreview = useCallback((doc, options = {}) => {
    if (!doc) return null;
    const { variant = "dialog" } = options;
    const previewType = getDocumentType(doc.url);

    if (previewType === "image") {
      return (
        <Box
          component="img"
          src={doc.url}
          alt={doc.label}
          sx={{
            width: "100%",
            maxHeight: variant === "inline" ? 520 : 720,
            objectFit: "contain",
            borderRadius: 2,
            border: variant === "inline" ? "1px solid" : 0,
            borderColor: "divider",
          }}
        />
      );
    }

    if (previewType === "pdf") {
      return (
        <Box
          component="iframe"
          title={doc.label}
          src={`${doc.url}#toolbar=1`}
          sandbox="allow-scripts allow-same-origin"
          sx={{
            width: "100%",
            minHeight: variant === "inline" ? 500 : 540,
            border: 0,
            borderRadius: 2,
            boxShadow: (t) => t.shadows[1],
            border: variant === "inline" ? "1px solid" : 0,
            borderColor: "divider",
          }}
        />
      );
    }

    return (
      <Stack spacing={2} alignItems="center" py={4}>
        <InsertDriveFileOutlinedIcon color="action" sx={{ fontSize: 48 }} />
        <Typography variant="body1" align="center">
          Preview for this file type is not available. You can open the document
          in a new tab instead.
        </Typography>
        <Button
          variant="contained"
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open document
        </Button>
      </Stack>
    );
  }, []);

  const renderInfoValue = useCallback((item) => {
    const { value, normalized, label } = item;

    if (Array.isArray(value)) {
      const chips = value
        .flat()
        .map((entry) => {
          if (entry === null || entry === undefined) return null;
          if (typeof entry === "string") return entry.trim();
          if (
            typeof entry === "object" &&
            entry !== null &&
            "label" in entry &&
            entry.label
          ) {
            return `${entry.label}`.trim();
          }
          return `${entry}`.trim();
        })
        .filter(Boolean);

      if (chips.length === 0) return normalized;

      return (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 0.5 }}
        >
          {chips.map((chipValue, index) => (
            <Chip
              key={`${label}-${chipValue}-${index}`}
              label={chipValue}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      );
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (label === "Email") {
        return (
          <Link href={`mailto:${trimmed}`} underline="hover">
            {trimmed}
          </Link>
        );
      }

      if (label === "Phone") {
        return (
          <Link href={`tel:${trimmed.replace(/\s+/g, "")}`} underline="hover">
            {trimmed}
          </Link>
        );
      }

      if (isUrl(trimmed)) {
        return (
          <Link href={trimmed} target="_blank" rel="noopener noreferrer">
            {trimmed}
          </Link>
        );
      }
    }

    return normalized;
  }, []);

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/mentor-applications")}
          >
            Back to applications
          </Button>

          {application && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                disabled={approving || rejecting || isRejected || isApproved}
                onClick={handleOpenRejectDialog}
              >
                {rejecting
                  ? "Rejecting..."
                  : isRejected
                  ? "Already rejected"
                  : isUpgradeRequest
                  ? "Reject Upgrade"
                  : "Reject application"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={approving || rejecting || isApproved || isRejected}
                onClick={handleApprove}
              >
                {approving
                  ? "Approving..."
                  : isApproved
                  ? "Already approved"
                  : isUpgradeRequest
                  ? "Approve Upgrade"
                  : "Approve application"}
              </Button>
            </Stack>
          )}
        </Stack>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            data-testid="mentor-application-detail-error"
          >
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            data-testid="mentor-application-detail-success"
          >
            {successMessage}
          </Alert>
        )}

        {!loading && isUpgradeRequest && (
          <Alert severity="info" icon={false}>
            <strong>Pro Upgrade Request</strong> — This mentor is currently Basic and has requested an upgrade to Pro. Approving will promote them to Pro; rejecting will restore their Basic status.
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {application ? (
              <Stack spacing={2}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Applicant information
                    </Typography>
                    <Grid container spacing={2.5}>
                      {infoItems.map((item) => {
                        const valueNode = renderInfoValue(item);
                        const isElement = React.isValidElement(valueNode);
                        const statusColor = getStatusChipColor(item.normalized);

                        return (
                          <Grid item xs={12} sm={6} lg={4} key={item.label}>
                            <Box
                              sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                backgroundColor: "background.default",
                                height: "100%",
                              }}
                            >
                              <Stack spacing={0.75}>
                                <Typography
                                  variant="overline"
                                  color="text.secondary"
                                  sx={{ letterSpacing: 0.6 }}
                                >
                                  {item.label}
                                </Typography>
                                {item.label === "Status" ? (
                                  <Chip
                                    label={item.normalized}
                                    color={statusColor}
                                    variant={
                                      statusColor === "default" ? "outlined" : "filled"
                                    }
                                    size="small"
                                    sx={{ mt: 0.5, alignSelf: "flex-start" }}
                                  />
                                ) : isElement ? (
                                  valueNode
                                ) : (
                                  <Typography variant="body1" color="text.primary">
                                    {valueNode}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>

                {(bioText || motivationText) && (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        {bioText && (
                          <Stack spacing={0.5}>
                            <Typography variant="h6">About the mentor</Typography>
                            <Typography variant="body1" color="text.primary">
                              {bioText}
                            </Typography>
                          </Stack>
                        )}

                        {bioText && motivationText && <Divider />}

                        {motivationText && (
                          <Stack spacing={0.5}>
                            <Typography variant="h6">
                              Motivation to join
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              {motivationText}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {documentLinks.length > 0 && (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Documents
                      </Typography>
                      <Stack spacing={2}>
                        {documentLinks.map((doc) => {
                          const type = getDocumentType(doc.url);
                          return (
                            <Stack
                              key={`${doc.label}-${doc.url}`}
                              spacing={1.5}
                              sx={{
                                p: { xs: 2, sm: 3 },
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                backgroundColor: "background.paper",
                              }}
                            >
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  flexWrap="wrap"
                                >
                                  <Typography variant="subtitle1">
                                    {doc.label}
                                  </Typography>
                                  <Chip
                                    icon={getDocumentIcon(type)}
                                    label={getDocumentTypeLabel(type)}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                                <Button
                                  component="a"
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="small"
                                  variant="text"
                                >
                                  Open in new tab
                                </Button>
                              </Stack>
                              {renderDocumentPreview(doc, { variant: "inline" })}
                            </Stack>
                          );
                        })}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            ) : (
              <Alert severity="info">
                The requested mentor application could not be found.
              </Alert>
            )}
          </>
        )}
      </Stack>

      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Optionally add a reason for rejecting this application. The mentor
            will be notified of the decision.
          </DialogContentText>
          <TextField
            margin="normal"
            label="Reason"
            placeholder="Provide a brief explanation (optional)"
            fullWidth
            multiline
            minRows={3}
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            disabled={rejecting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} disabled={rejecting}>
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={rejecting}
          >
            {rejecting ? "Rejecting..." : "Confirm rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </SideBarLayout>
  );
};

export default MentorApplicationDetail;

