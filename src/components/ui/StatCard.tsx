import { type ReactNode } from "react";
import { Card, CardContent, Box, Heading, Text } from "@/design-system/components";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, icon, subtitle, color }: StatCardProps) {
  const iconContainerStyle = color
    ? {
        backgroundColor: `${color}20`,
        color: color,
      }
    : undefined;

  return (
    <Card flat className="bg-background-glass border border-border">
      <CardContent className="flex items-center gap-4">
        <Box
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary"
          style={iconContainerStyle}
        >
          {icon}
        </Box>
        <Box>
          <Heading level={3}>{value}</Heading>
          <Text variant="body2" color="secondary">
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color="muted">
              {subtitle}
            </Text>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatCard;
