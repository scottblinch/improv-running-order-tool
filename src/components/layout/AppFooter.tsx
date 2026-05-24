import { Trans } from '@/i18n';

const AUTHOR_WEBSITE = 'https://scottblinch.me';
const GITHUB_FEEDBACK =
  'https://github.com/scottblinch/improv-running-order-tool/issues';
const LICENSE_URL =
  'https://github.com/scottblinch/improv-running-order-tool/blob/main/LICENSE';

const linkClassName =
  'underline-offset-4 hover:text-foreground hover:underline';

export function AppFooter() {
  return (
    <footer className="shrink-0 border-t px-6 py-3 print:hidden">
      <p className="text-center text-xs text-muted-foreground">
        <Trans
          i18nKey="footer.credit"
          components={{
            authorLink: (
              <a
                href={AUTHOR_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              />
            ),
            githubLink: (
              <a
                href={GITHUB_FEEDBACK}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              />
            ),
            licenseLink: (
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              />
            ),
          }}
        />
      </p>
    </footer>
  );
}
