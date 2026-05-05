import { BookOpen, Send } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube, } from "react-icons/fa6";

const footerLinks = {
  "Khám phá": [
    { label: "Tất cả khóa học", href: "#" },
    { label: "Lộ trình học", href: "#" },
    { label: "Bootcamp", href: "#" },
    { label: "Live Class", href: "#" },
  ],
  "Giảng viên": [
    { label: "Trở thành giảng viên", href: "#" },
    { label: "Tài nguyên giảng dạy", href: "#" },
    { label: "Cộng đồng giảng viên", href: "#" },
  ],
  "Hỗ trợ": [
    { label: "Trung tâm trợ giúp", href: "#" },
    { label: "Liên hệ", href: "#" },
    { label: "Chính sách bảo mật", href: "#" },
    { label: "Điều khoản sử dụng", href: "#" },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-bg2">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="mb-4 flex items-center gap-2 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-amber">
                <BookOpen className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-sora text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                NexLearn
              </span>
            </a>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Nền tảng học trực tuyến hàng đầu Việt Nam, kết nối học viên với
              chuyên gia thực chiến.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-slate-600 dark:text-slate-400 transition-colors hover:border-brand-amber hover:text-brand-amber no-underline"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold tracking-wide text-slate-900 dark:text-white">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 transition-colors hover:text-brand-amber2 no-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-brand-border" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NexLearn. Made with ☕ in Vietnam.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              Điều khoản
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
