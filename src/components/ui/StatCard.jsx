/* ============================================
   CareerPilot AI — StatCard Component
   Glassmorphic stat card with icon, value,
   label, and optional trend indicator.
   ============================================ */

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon — lucide icon element
 * @param {string|number} props.value — stat value
 * @param {string} props.label — stat label
 * @param {string} [props.color] — accent color
 * @param {string} [props.trend] — e.g. "+12%" or "New"
 * @param {string} [props.trendDirection] — "up" | "down" | "neutral"
 * @param {string} [props.className]
 */
export function StatCard({
  icon,
  value,
  label,
  color = 'var(--color-primary)',
  trend,
  trendDirection = 'neutral',
  className = '',
}) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        <div
          className="stat-card-icon"
          style={{
            backgroundColor: `${color}12`,
            color: color,
          }}
        >
          {icon}
        </div>
        {trend && (
          <span className={`stat-card-trend stat-card-trend-${trendDirection}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}
