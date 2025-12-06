export { default as DashboardIcon } from "@mui/icons-material/Dashboard";
export { default as WorkIcon } from "@mui/icons-material/Work";
export { default as SearchIcon } from "@mui/icons-material/Search";
export { default as BusinessIcon } from "@mui/icons-material/Business";
export { default as AssessmentIcon } from "@mui/icons-material/Assessment";
export { default as HomeIcon } from "@mui/icons-material/Home";
export { default as SettingsIcon } from "@mui/icons-material/Settings";
export { default as MenuIcon } from "@mui/icons-material/Menu";

export { default as AddIcon } from "@mui/icons-material/Add";
export { default as EditIcon } from "@mui/icons-material/Edit";
export { default as DeleteIcon } from "@mui/icons-material/Delete";
export { default as CloseIcon } from "@mui/icons-material/Close";
export { default as MoreVertIcon } from "@mui/icons-material/MoreVert";
export { default as MoreHorizIcon } from "@mui/icons-material/MoreHoriz";
export { default as RefreshIcon } from "@mui/icons-material/Refresh";
export { default as SaveIcon } from "@mui/icons-material/Save";
export { default as SendIcon } from "@mui/icons-material/Send";
export { default as DownloadIcon } from "@mui/icons-material/Download";
export { default as UploadIcon } from "@mui/icons-material/Upload";
export { default as FilterListIcon } from "@mui/icons-material/FilterList";
export { default as SortIcon } from "@mui/icons-material/Sort";

export { default as ArrowBackIcon } from "@mui/icons-material/ArrowBack";
export { default as ArrowForwardIcon } from "@mui/icons-material/ArrowForward";
export { default as ArrowUpIcon } from "@mui/icons-material/ArrowUpward";
export { default as ArrowDownIcon } from "@mui/icons-material/ArrowDownward";
export { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
export { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
export { default as ExpandMoreIcon } from "@mui/icons-material/ExpandMore";
export { default as ExpandLessIcon } from "@mui/icons-material/ExpandLess";
export { default as OpenInNewIcon } from "@mui/icons-material/OpenInNew";

export { default as CheckIcon } from "@mui/icons-material/Check";
export { default as CheckCircleIcon } from "@mui/icons-material/CheckCircle";
export { default as ErrorIcon } from "@mui/icons-material/Error";
export { default as WarningIcon } from "@mui/icons-material/Warning";
export { default as InfoIcon } from "@mui/icons-material/Info";
export { default as HelpIcon } from "@mui/icons-material/Help";
export { default as HourglassEmptyIcon } from "@mui/icons-material/HourglassEmpty";
export { default as TrendingUpIcon } from "@mui/icons-material/TrendingUp";
export { default as TrendingDownIcon } from "@mui/icons-material/TrendingDown";
export { default as BoltIcon } from "@mui/icons-material/Bolt";
export { default as TargetIcon } from "@mui/icons-material/TrackChanges";

export { default as LocationOnIcon } from "@mui/icons-material/LocationOn";
export { default as CalendarTodayIcon } from "@mui/icons-material/CalendarToday";
export { default as EventIcon } from "@mui/icons-material/Event";
export { default as NoteIcon } from "@mui/icons-material/Note";
export { default as DescriptionIcon } from "@mui/icons-material/Description";
export { default as AttachFileIcon } from "@mui/icons-material/AttachFile";
export { default as LinkIcon } from "@mui/icons-material/Link";
export { default as EmailIcon } from "@mui/icons-material/Email";
export { default as PhoneIcon } from "@mui/icons-material/Phone";

export { default as PersonIcon } from "@mui/icons-material/Person";
export { default as PeopleIcon } from "@mui/icons-material/People";
export { default as AccountCircleIcon } from "@mui/icons-material/AccountCircle";
export { default as LogoutIcon } from "@mui/icons-material/Logout";
export { default as LoginIcon } from "@mui/icons-material/Login";

export { default as GoogleIcon } from "@mui/icons-material/Google";
export { default as GitHubIcon } from "@mui/icons-material/GitHub";
export { default as LinkedInIcon } from "@mui/icons-material/LinkedIn";
export { default as TwitterIcon } from "@mui/icons-material/Twitter";

export { default as LightModeIcon } from "@mui/icons-material/LightMode";
export { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
export { default as VisibilityIcon } from "@mui/icons-material/Visibility";
export { default as VisibilityOffIcon } from "@mui/icons-material/VisibilityOff";
export { default as StarIcon } from "@mui/icons-material/Star";
export { default as StarBorderIcon } from "@mui/icons-material/StarBorder";
export { default as FavoriteIcon } from "@mui/icons-material/Favorite";
export { default as FavoriteBorderIcon } from "@mui/icons-material/FavoriteBorder";
export { default as BookmarkIcon } from "@mui/icons-material/Bookmark";
export { default as BookmarkBorderIcon } from "@mui/icons-material/BookmarkBorder";

import type { SvgIconProps } from "@mui/material/SvgIcon";

export type IconProps = SvgIconProps;

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type IconSize = keyof typeof iconSizes;
