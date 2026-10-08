import { Link } from 'react-router-dom'

/** Left-aligned block section header: eyebrow, title, lead, optional action link. */
export default function SectionHead({ eyebrow, title, lead, action, className = '' }) {
  return (
    <div className={`block-head ${className}`}>
      <div className="block-head-text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-title">{title}</h2>
        {lead && <p className="block-head-lead">{lead}</p>}
      </div>
      {action?.to && (
        <Link to={action.to} className="view-all-link">{action.label}</Link>
      )}
    </div>
  )
}
