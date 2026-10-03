export default function PageHeader({ title, children, badge }) {
  return (
    <section className="ph">
      <div className="w ph-inner">
        <div className="ph-breadcrumb">
          <span className="live-beacon-dot"></span>
          <span>MIM NEWS DIRECTORY</span>
          <span>//</span>
          <span>{badge || title}</span>
        </div>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </section>
  )
}
