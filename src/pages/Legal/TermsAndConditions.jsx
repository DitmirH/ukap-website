import CustomPage from '../CustomPage'

// Default terms content. Publishing a Custom Page in Sanity with the slug
// "terms-and-conditions" overrides everything below.
function TermsContent() {
  return (
    <>
      <p className="page-p">
        Welcome to the website of the UKAP Foundation (UK Albanian Professionals
        Foundation), a UK-registered charity (Charity No. 1215303). By using this
        website you agree to these terms and conditions. If you do not agree with any
        part of them, please do not use the site.
      </p>

      <h2 className="page-h2">Use of this website</h2>
      <p className="page-p">
        This website is provided to share information about the UKAP Foundation, our
        programmes, events and ways to support our work. You agree to use it only for
        lawful purposes and in a way that does not infringe the rights of, or restrict
        the use of the site by, anyone else.
      </p>

      <h2 className="page-h2">Content and intellectual property</h2>
      <p className="page-p">
        Unless otherwise stated, the content of this website — including text, logos,
        branding, images and design — belongs to the UKAP Foundation or is used with
        permission. You may view, download and print content for personal,
        non-commercial use. Any other reproduction or distribution requires our prior
        written consent.
      </p>

      <h2 className="page-h2">Donations, tickets and third-party services</h2>
      <p className="page-p">
        Donations and event ticket purchases are processed by third-party platforms
        (such as Zeffy or the ticketing provider shown at checkout). Those transactions
        are subject to the terms and privacy policies of the relevant provider. Event
        details may change; where an event is cancelled or postponed we will publish
        updates on this website and contact registered attendees where possible.
      </p>

      <h2 className="page-h2">Accuracy of information</h2>
      <p className="page-p">
        We work to keep the information on this website accurate and up to date, but we
        make no warranties as to its completeness or accuracy. Content is provided for
        general information and does not constitute professional advice.
      </p>

      <h2 className="page-h2">Links to other websites</h2>
      <p className="page-p">
        This website contains links to external websites, including those of partners
        and sponsors. We are not responsible for the content or practices of external
        sites, and a link does not imply endorsement.
      </p>

      <h2 className="page-h2">Liability</h2>
      <p className="page-p">
        To the fullest extent permitted by law, the UKAP Foundation accepts no liability
        for any loss or damage arising from the use of, or inability to use, this
        website or from reliance on its content. Nothing in these terms excludes or
        limits liability that cannot be excluded or limited under the law of England and
        Wales.
      </p>

      <h2 className="page-h2">Governing law</h2>
      <p className="page-p">
        These terms are governed by the law of England and Wales, and any disputes are
        subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2 className="page-h2">Changes and contact</h2>
      <p className="page-p">
        We may revise these terms at any time; the current version will always be
        published on this page. Questions about these terms should be sent to{' '}
        <a href="mailto:ukap@ukapfoundation.org" className="page-link">ukap@ukapfoundation.org</a>.
        Last updated: July 2026.
      </p>
    </>
  )
}

export default function TermsAndConditions() {
  return (
    <CustomPage
      slug="terms-and-conditions"
      fallbackTitle="Terms and Conditions"
      fallbackDescription="The terms that apply when you use the UKAP Foundation website."
      fallbackBody={<TermsContent />}
    />
  )
}
