import { Monitor, Moon, Sun } from 'lucide-react';

import type { Theme } from '@/components/theme/theme';
import { useTheme } from '@/components/theme/useTheme';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative shrink-0"
              aria-label={t('theme.toggle')}
            >
              <Sun
                aria-hidden
                className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
              <Moon
                aria-hidden
                className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('theme.toggle')}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          <DropdownMenuRadioItem value="light" title={t('theme.lightItemTitle')}>
            <Sun aria-hidden className="size-4" />
            {t('theme.light')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" title={t('theme.darkItemTitle')}>
            <Moon aria-hidden className="size-4" />
            {t('theme.dark')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" title={t('theme.systemItemTitle')}>
            <Monitor aria-hidden className="size-4" />
            {t('theme.system')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
