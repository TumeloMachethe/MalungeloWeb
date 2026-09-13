MALUNGELO PROPERTIES — PRIVACY + TERMS UPDATE
Prepared: 13 September 2026

REPLACE THESE 3 FILES ON YOUR WEBSITE ROOT:
1. apply.html
2. style.css
3. script.js

ADD THESE 4 NEW FILES TO THE SAME ROOT FOLDER:
4. terms.html
5. privacy.html
6. residence-rules.html
7. cancellation-policy.html

WHAT CHANGED
- Added a clear legal/consent section to the accommodation application.
- Kept the existing Application Declaration and made its acceptance explicit.
- Added a Terms & Policies review pop-up before acceptance.
- Added a separate required privacy-processing consent.
- Added links to the full Terms, Privacy Policy, Residence Rules and Cancellation Policy.
- Added a legal policy version and consent timestamp to each submitted application.
- Fixed checkbox validation so required legal boxes cannot be bypassed by the custom FormSubmit submission code.
- Kept double-submit protection.
- script.js automatically adds legal links to existing website footers that use:
      <footer> ... <div class="footer-inner"> ... </div> ... </footer>
  This means pages such as index.html can receive the new legal links without editing every page manually, provided they already load script.js.
- Added responsive dark/light styling for all legal pages.

NEW FORM FIELDS SENT TO FORMSUBMIT AND MAKE.COM
- Application Declaration Accepted
- Terms and Policies Accepted
- Privacy Processing Consent
- Legal Policy Version
- Consent Accepted At

IMPORTANT FOR MAKE.COM / EXCEL
Your Make webhook will receive the new fields automatically because script.js sends the whole form.
However, Excel will only store these values if your Make "Add a Row" step has matching columns mapped.

Suggested new Excel columns:
- Declaration Accepted
- Terms Accepted
- Privacy Consent
- Legal Policy Version
- Consent Accepted At

Then map:
- Application Declaration Accepted -> Declaration Accepted
- Terms and Policies Accepted -> Terms Accepted
- Privacy Processing Consent -> Privacy Consent
- Legal Policy Version -> Legal Policy Version
- Consent Accepted At -> Consent Accepted At

UPLOAD ORDER
1. Upload the four new legal HTML pages.
2. Replace style.css.
3. Replace script.js.
4. Replace apply.html.
5. Open the live apply page and test one application.
6. Check:
   - declaration pop-up opens
   - terms review pop-up opens
   - privacy box is required
   - application submits once
   - FormSubmit email includes the consent fields
   - Make receives one webhook
   - Excel receives the mapped consent fields after you update the Make mapping

LEGAL NOTE
These pages are a practical website draft based on the current Malungelo application flow and South African privacy/consumer-law principles. They do not replace review by a South African attorney or your final signed accommodation/lease agreement. Update any business-registration, Information Officer, fee, deposit, refund, lease or property-specific rule details if your actual operations differ from the wording in these pages.
