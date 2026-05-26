import { Drama } from 'lucide-react';

import { Trans, useTranslation } from '@/i18n';
import { usePrivacyDialogStore } from '@/store/usePrivacyDialogStore';
import { cn } from '@/lib/utils';

const AUTHOR_WEBSITE = 'https://scottblinch.me';
const GITHUB_FEEDBACK =
  'https://github.com/scottblinch/improv-running-order-tool/issues';
const LICENSE_URL =
  'https://github.com/scottblinch/improv-running-order-tool/blob/main/LICENSE';

const linkClassName = 'underline-offset-4 hover:text-foreground';

const inlineLinkButtonClassName = `${linkClassName} inline h-auto cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit underline hover:no-underline focus-visible:no-underline`;

type AppFooterProps = {
  className?: string;
};

export function AppFooter({ className }: AppFooterProps) {
  const { t } = useTranslation();
  const setPrivacyOpen = usePrivacyDialogStore((state) => state.setOpen);

  return (
    <footer className={cn('border-t pt-4 print:hidden', className)}>
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Drama aria-hidden className="size-3.5 shrink-0 opacity-70" />
        <p className="text-center">
          <Trans
            i18nKey="footer.credit"
            components={{
              authorLink: (
                <a
                  href={AUTHOR_WEBSITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                  aria-label={t('footer.authorLinkAria')}
                />
              ),
              githubLink: (
                <a
                  href={GITHUB_FEEDBACK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                  aria-label={t('footer.githubLinkAria')}
                />
              ),
              licenseLink: (
                <a
                  href={LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                  aria-label={t('footer.licenseLinkAria')}
                />
              ),
              privacyLink: (
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className={inlineLinkButtonClassName}
                  aria-label={t('footer.privacyLinkAria')}
                />
              ),
            }}
          />
        </p>
      </div>
    </footer>
  );
}
