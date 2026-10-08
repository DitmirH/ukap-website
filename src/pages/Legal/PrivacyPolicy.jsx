import CustomPage from '../CustomPage'

// Default privacy policy content. Publishing a Custom Page in Sanity with
// the slug "privacy-policy" overrides everything below.
function PrivacyContent() {
  return (
    <>
      <p className="page-p">
        The UKAP Foundation (UK Albanian Professionals Foundation) is a UK-registered
        charity (Charity No. 1215303). We are committed to protecting your privacy and
        handling your personal data in accordance with the UK General Data Protection
        Regulation (UK GDPR) and the Data Protection Act 2018. This policy explains what
        information we collect, how we use it, and the rights you have over it.
      </p>

      <h2 className="page-h2">Who we are</h2>
      <p className="page-p">
        For the purposes of data protection law, the UKAP Foundation is the data
        controller of the personal information described in this policy. You can contact
        us about anything in this policy at{' '}
        <a href="mailto:ukap@ukapfoundation.org" className="page-link">ukap@ukapfoundation.org</a>.
      </p>

      <h2 className="page-h2">What information we collect</h2>
      <p className="page-p">
        We collect information you give us directly: your name and contact details when
        you fill in a form on this website, register for one of our events, apply to a
        programme such as mentoring or a scholarship, volunteer with us, or contact us by
        email. If you make a donation or buy an event ticket, the payment is handled by
        our third-party providers (such as Zeffy or the ticketing platform shown at
        checkout) — we do not receive or store your card details. If you tick the Gift
        Aid box when donating, we collect the details HMRC requires (your full name, home
        address and postcode).
      </p>

      <h2 className="page-h2">How we use it</h2>
      <p className="page-p">
        We use your information to respond to your enquiries, administer events,
        programmes and applications, process donations and claim Gift Aid where you have
        asked us to, keep proper records as required of a registered charity, and — only
        where you have agreed — send you updates about our work. Our lawful bases for
        this are consent, the performance of a contract with you, our legal obligations
        (for example Gift Aid records), and our legitimate interests in running the
        charity effectively.
      </p>

      <h2 className="page-h2">Who we share it with</h2>
      <p className="page-p">
        We never sell your data. We share it only with service providers who help us run
        this website and our operations — such as our content platform (Sanity), website
        hosting, email delivery, and donation and ticketing platforms — and with HMRC
        where Gift Aid is claimed. These providers process data on our instructions and
        are bound by their own data protection obligations.
      </p>

      <h2 className="page-h2">How long we keep it</h2>
      <p className="page-p">
        We keep personal data only as long as needed for the purpose it was collected.
        Gift Aid records are kept for the period required by HMRC (currently six years).
        Enquiry emails and event registrations are reviewed and deleted when no longer
        needed.
      </p>

      <h2 className="page-h2">Your rights</h2>
      <p className="page-p">
        Under UK GDPR you have the right to access the personal data we hold about you,
        to have it corrected or erased, to restrict or object to our processing of it,
        to data portability, and to withdraw consent at any time where processing is
        based on consent. To exercise any of these rights, email{' '}
        <a href="mailto:ukap@ukapfoundation.org" className="page-link">ukap@ukapfoundation.org</a>.
        If you are unhappy with how we have handled your data, you can complain to the
        Information Commissioner's Office (ICO) at{' '}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="page-link">ico.org.uk</a>.
      </p>

      <h2 className="page-h2">Cookies and analytics</h2>
      <p className="page-p">
        This website uses only the cookies and similar technologies necessary for it to
        function, and any analytics we use are configured to aggregate data rather than
        identify individuals. Embedded services (such as the donation form) may set
        their own cookies, governed by those providers' policies.
      </p>

      <h2 className="page-h2">Changes to this policy</h2>
      <p className="page-p">
        We may update this policy from time to time. The latest version will always be
        published on this page. Last updated: July 2026.
      </p>
    </>
  )
}

export default function PrivacyPolicy() {
  return (
    <CustomPage
      slug="privacy-policy"
      fallbackTitle="Privacy Policy"
      fallbackDescription="How the UKAP Foundation collects, uses and protects your personal information."
      fallbackBody={<PrivacyContent />}
    />
  )
}
