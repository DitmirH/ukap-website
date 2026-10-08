/** Gold strip with the icon and "UKAP FOUNDATION" set vertically (brand guide cover). */
export default function BrandStrip({ className = '' }) {
  return (
    <div className={`brand-strip ${className}`} aria-hidden="true">
      <img src="/brand/ukap-mark.png" alt="" />
      <div className="brand-strip-word">
        <b>UKAP</b>
        <span>Foundation</span>
      </div>
    </div>
  )
}
