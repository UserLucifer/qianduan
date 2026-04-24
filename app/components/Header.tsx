import Link from 'next/link';
import ThemeToggle from "./theme-toggle";

const navigationItems = [
  { name: "产品", href: "#" },
  { name: "博客", href: "#" },
  { name: "解决方案", href: "#" },
  { name: "行业", href: "#" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          算力租赁
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href} className="site-nav__link">
              {item.name}
            </Link>
          ))}
          
          <div className="nav-dropdown-wrapper">
            <span className="site-nav__link nav-dropdown-trigger">
              公司
            </span>
            <div className="nav-dropdown">
              <div className="nav-dropdown__inner">
                <div className="nav-dropdown__column">
                  <div className="nav-dropdown__title">{"//内部"}</div>
                  <Link href="/about" className="nav-dropdown__link">关于我们</Link>
                  <Link href="/sustainability" className="nav-dropdown__link">可持续发展</Link>
                  <Link href="/enterprise" className="nav-dropdown__link">企业解决方案</Link>
                </div>
                <div className="nav-dropdown__divider"></div>
                <div className="nav-dropdown__column">
                  <div className="nav-dropdown__title">{"//资源"}</div>
                  <Link href="/use-cases" className="nav-dropdown__link">产品用例</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="site-header__controls">
          <ThemeToggle />
          <Link href="/login" className="auth-signup">
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}
