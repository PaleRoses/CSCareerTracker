"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AppBar, Button, Flex, Text } from "@/design-system/components";
import { LogoutIcon, RefreshIcon } from "@/design-system/icons";
import { AUTH_CALLBACKS, ROUTES } from "@/config/routes";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { resetUserRole } from "@/features/auth/actions";

export default function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleResetRole = () => {
    startTransition(async () => {
      const result = await resetUserRole();
      if (result.success) {
        router.push(ROUTES.selectRole);
      }
    });
  };

  return (
    <AppBar position="fixed" sidebarOffset className="justify-end">
      {session?.user && (
        <Flex align="center" gap={4} className="w-full justify-end">
          <Text variant="body2" color="secondary">
            {session.user.name || session.user.email}
          </Text>
          <Button
            variant="ghost"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleResetRole}
            disabled={isPending}
            className="text-foreground/50 hover:text-warning hover:bg-warning/10"
          >
            {isPending ? "Resetting..." : "Reset Role"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={() => signOut({ callbackUrl: AUTH_CALLBACKS.SIGN_OUT_SUCCESS })}
            className="border-white/20 text-foreground/70 hover:border-primary hover:text-primary hover:bg-primary/10"
            aria-label={UI_STRINGS.a11y.signOut}
          >
            {UI_STRINGS.buttons.signOut}
          </Button>
        </Flex>
      )}
    </AppBar>
  );
}
