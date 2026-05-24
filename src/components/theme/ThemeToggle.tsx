import { Monitor, Moon, Sun } from 'lucide-react';

import type { Theme } from '@/components/theme/theme';
import { useTheme } from '@/components/theme/useTheme';
import { Button } from '@/components/ui/button';
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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0">
          <Sun
            aria-hidden
            className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          />
          <Moon
            aria-hidden
            className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          <DropdownMenuRadioItem value="light">
            <Sun aria-hidden className="size-4" />
            {t('theme.light')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon aria-hidden className="size-4" />
            {t('theme.dark')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor aria-hidden className="size-4" />
            {t('theme.system')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
