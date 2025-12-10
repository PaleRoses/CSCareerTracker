import { List } from "@/design-system/components";
import { SectionCard, DetailItem } from "@/features/shared";
import {
  OpenInNewIcon,
  LocationOnIcon,
  CalendarTodayIcon,
} from "@/design-system/icons";
import { formatDate } from "@/lib/utils";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

interface ApplicationMetadataProps {
  dateApplied: string;
  location?: string;
  jobUrl?: string;
}

export function ApplicationMetadata({
  dateApplied,
  location,
  jobUrl,
}: ApplicationMetadataProps) {
  return (
    <SectionCard title="Details">
      <List dense disablePadding>
        <DetailItem
          icon={<CalendarTodayIcon fontSize="small" />}
          label="Date Applied"
          value={formatDate(dateApplied)}
        />
        <DetailItem
          icon={<LocationOnIcon fontSize="small" />}
          label="Location"
          value={location || "Not specified"}
        />
        {jobUrl && (
          <DetailItem
            icon={<OpenInNewIcon fontSize="small" />}
            label="Job Posting"
            value={
              <a
                href={jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {UI_STRINGS.buttons.viewOriginalPosting}
              </a>
            }
          />
        )}
      </List>
    </SectionCard>
  );
}

export default ApplicationMetadata;
