import { useState } from 'react';

import { PrivacyDialog } from '@/components/layout/PrivacyDialog';
import { Trans } from '@/i18n';

const AUTHOR_WEBSITE = 'https://scottblinch.me';
const GITHUB_FEEDBACK =
  'https://github.com/scottblinch/improv-running-order-tool/issues';
const LICENSE_URL =
  'https://github.com/scottblinch/improv-running-order-tool/blob/main/LICENSE';

const linkClassName = 'underline-offset-4 hover:text-foreground';

const inlineLinkButtonClassName = `${linkClassName} inline h-auto border-0 bg-transparent p-0 font-inherit text-inherit cursor-pointer`;

export function AppFooter() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="border-t pt-4 print:hidden">
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
              privacyLink: (
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className={inlineLinkButtonClassName}
                />
              ),
            }}
          />
        </p>
      </footer>

      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </>
  );
}
