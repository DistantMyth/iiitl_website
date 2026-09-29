"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Search,
  X,
  Menu,
  Accessibility,
  ArrowRight,
  GraduationCap,
  Minus,
  Plus,
} from "lucide-react";
import { groups, roles, programs, programPath } from "@/lib/catalog";
export function Modal({
  title,
  trigger,
  children,
  open,
  onOpenChange,
}: {
  title: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal">
          <div className="modal-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Close dialog">
              <X size={21} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {title} options and details
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Login({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      title="Your campus. One portal."
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger || (
          <button className="login-button">
            Portal login <ArrowUpRight size={15} />
          </button>
        )
      }
    >
      <p className="muted">
        Choose a role to explore the campus portal. No account required.
      </p>
      <div className="demo-note">
        Interactive demonstration · Sample records are saved in this browser.
      </div>
      <div className="role-grid">
        {roles.map((r, i) => (
          <Link
            key={r}
            onClick={() => setOpen(false)}
            href={`/dashboard/${r.toLowerCase().replaceAll(" ", "-")}`}
          >
            <span className="role-icon">
              <GraduationCap size={22} />
            </span>
            <strong>Login as {r}</strong>
            <span>
              {
                [
                  "Results, fees & campus services",
                  "Courses & marks submission",
                  "Moderation & result publishing",
                  "Ledgers, reconciliation & refunds",
                  "Tenders & procurement",
                  "Content, programs & people",
                  "Roles, permissions & all modules",
                ][i]
              }
            </span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
    </Modal>
  );
}
export function Header() {
  const path = usePathname();
  const [menu, setMenu] = useState("");
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [contrast, setContrast] = useState(false);
  const [size, setSize] = useState(100);
  const [hindi, setHindi] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setMenu("");
    setMobile(false);
  }, [path]);
  // Hide the header on scroll down, bring it back on scroll up.
  // The logo slides out to the left, the actions slide out to the right,
  // and the nav + brand rows travel up.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const delta = y - last;
      // ignore tiny jitter and rubber-band overscroll
      if (Math.abs(delta) < 6) return;
      if (y < 90) setHidden(false);
      else setHidden(delta > 0);
      last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.style.fontSize = `${size}%`;
  }, [contrast, size]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu("");
        setMobile(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  const links = [
    ...groups.flatMap((g) => g.links),
    ...programs.map((p) => [`${p.degree} ${p.name}`, programPath(p)]),
  ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className={hidden ? "utility utility-hidden" : "utility"}>
        <span>An Institute of National Importance</span>
        <div>
          <Link href="/statutory/rti">RTI</Link>
          <Link href="/tenders">Tenders</Link>
          <button onClick={() => setHindi(!hindi)}>
            {hindi ? "English" : "हिन्दी"}
          </button>
          <Modal
            title="Accessibility preferences"
            trigger={
              <button aria-label="Accessibility settings">
                <Accessibility size={16} />
              </button>
            }
          >
            <p>Adjust the website to suit your reading preferences.</p>
            <label className="toggle">
              <input
                type="checkbox"
                checked={contrast}
                onChange={(e) => setContrast(e.target.checked)}
              />{" "}
              High contrast
            </label>
            <div className="button-row">
              <button
                className="btn secondary"
                onClick={() => setSize(Math.max(90, size - 10))}
              >
                <Minus size={16} /> Text
              </button>
              <span>{size}%</span>
              <button
                className="btn secondary"
                onClick={() => setSize(Math.min(130, size + 10))}
              >
                <Plus size={16} /> Text
              </button>
            </div>
            <p className="muted">
              Motion follows your device’s reduced-motion preference.
            </p>
          </Modal>
          <Login />
        </div>
      </div>
      <header className={hidden ? "site-header header-hidden" : "site-header"}>
        <div className="brand-row">
          <Link className="brand" href="/" aria-label="IIIT Lucknow home">
            <span className="brand-mark">
              <img
                src="/assets/logos/iiitl_main_logo.png"
                alt="Indian Institute of Information Technology, Lucknow"
                width="2269"
                height="2039"
              />
            </span>
            <span className="brand-name">
              <strong>
                {hindi
                  ? "भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ"
                  : "Indian Institute of Information Technology, Lucknow"}
              </strong>
              <span>
                {hindi
                  ? "Indian Institute of Information Technology, Lucknow"
                  : "भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ"}
                <i> · </i>
                <small>An Institute of National Importance</small>
              </span>
            </span>
          </Link>
          <div className="brand-actions">
            <button className="search-button" onClick={() => setSearch(true)}>
              <Search size={19} />
              <span>Find your way</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="mobile-toggle icon-button"
              onClick={() => setMobile(!mobile)}
              aria-label="Toggle navigation"
              aria-expanded={mobile}
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          className={mobile ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          {groups.map((g) => (
            <div className="nav-item" key={g.name}>
              <button
                onClick={() => setMenu(menu === g.name ? "" : g.name)}
                aria-expanded={menu === g.name}
                className={path.startsWith(g.path) ? "active" : ""}
              >
                {g.name}
                <span className="nav-plus">{menu === g.name ? "−" : "+"}</span>
              </button>
              {menu === g.name && (
                <div className="dropdown">
                  <Link className="dropdown-intro" href={g.path}>
                    <span>EXPLORE IIIT LUCKNOW</span>
                    <strong>{g.name}</strong>
                    <ArrowUpRight />
                  </Link>
                  <div>
                    {g.links.map(([n, p]) => (
                      <Link key={p} href={p}>
                        {n}
                        <ArrowRight size={16} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>
      <Modal
        title="Find your way around IIITL"
        open={search}
        onOpenChange={setSearch}
      >
        <div className="search-input">
          <Search size={20} />
          <input
            autoFocus
            placeholder="Search programs, fees, faculty…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="eyebrow">
          {query ? "Search results" : "Popular destinations"}
        </p>
        <div className="search-results">
          {links
            .filter(([n]) => n.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 12)
            .map(([n, p]) => (
              <Link key={n} href={p} onClick={() => setSearch(false)}>
                {n}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          {!links.some(([n]) =>
            n.toLowerCase().includes(query.toLowerCase()),
          ) && <p>No matches. Try “programs”, “fees”, or “faculty”.</p>}
        </div>
      </Modal>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-brand">
            IIIT Lucknow<span>ज्ञानम् अनन्तम्</span>
          </Link>
          <p>
            Ideas begin here.
            <br />
            Their impact goes everywhere.
          </p>
        </div>
        <div>
          <h3>Discover</h3>
          <Link href="/academics">Academics</Link>
          <Link href="/research">Research</Link>
          <Link href="/campus-life">Campus life</Link>
          <Link href="/placements">Placements</Link>
        </div>
        <div>
          <h3>Institute</h3>
          <Link href="/governance">Governance</Link>
          <Link href="/statutory/rti">RTI & disclosures</Link>
          <Link href="/statutory/nirf">NIRF</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/directory">All pages</Link>
        </div>
        <div>
          <h3>Come say hello</h3>
          <p>
            Chak Ganjaria, C. G. City
            <br />
            Lucknow, Uttar Pradesh 226002
          </p>
          <Link href="/contact">
            Contact & directions <ArrowUpRight size={14} />
          </Link>
          <Link href="/governance/anti-ragging">Student safety & support</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Indian Institute of Information
          Technology, Lucknow
        </span>
        <span>
          Frontend demonstration ·{" "}
          <Link href="/about/demo">About this preview</Link>
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
