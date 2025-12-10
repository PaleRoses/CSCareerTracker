import { type ReactNode } from "react";
import { Box, Heading, Text } from "@/design-system/components";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box className="flex justify-between items-start flex-wrap gap-4 mb-6">
      <Box>
        <Heading level={1} className={subtitle ? "mb-1" : ""}>
          {title}
        </Heading>
        {subtitle && (
          <Text color="secondary">{subtitle}</Text>
        )}
      </Box>
      {action}
    </Box>
  );
}
