export const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Pages Group
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.documentTypeListItem('customPage').title('Custom Pages'),
              S.documentTypeListItem('post').title('Blog Posts'),
              S.documentTypeListItem('event').title('Events'),
              S.documentTypeListItem('resource').title('Resources'),
              S.documentTypeListItem('donationPage').title('Donation Page'),
            ])
        ),

      // Components Group
      S.listItem()
        .title('Components')
        .child(
          S.list()
            .title('Components')
            .items([
              S.documentTypeListItem('heroSlide').title('Hero Slides'),
              S.documentTypeListItem('eventsSection').title("What's On (Events cards)"),
              S.documentTypeListItem('missionSection').title('Mission Section'),
              S.documentTypeListItem('announcementModal').title('Announcement Modal'),
              S.documentTypeListItem('programme').title('Programmes'),
              S.documentTypeListItem('contactForm').title('Contact Forms'),
              S.documentTypeListItem('teamMember').title('Team Members'),
              S.documentTypeListItem('author').title('Authors'),
              S.documentTypeListItem('sponsor').title('Sponsors'),
              S.documentTypeListItem('sponsorshipTier').title('Sponsorship Tiers'),
            ])
        ),
    ])
