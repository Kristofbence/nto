// Responsive presentation shell: 390×844 phone mockup on a grey backdrop for
// desktop; fills the viewport on phones (see media query in index.css).
export default function PhoneFrame({ children }) {
  return (
    <div className="nto-backdrop">
      <div className="nto-frame">{children}</div>
    </div>
  );
}
