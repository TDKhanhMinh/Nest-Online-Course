"use client";

import { BookOpen, Send } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations();

  const footerLinks = [
    {
      title: t("Nav.explore"),
      links: [
        { label: t("Footer.all_courses"), href: "#" },
        { label: t("Footer.learning_paths"), href: "#" },
        { label: t("Footer.bootcamp"), href: "#" },
        { label: t("Footer.live_class"), href: "#" },
      ],
    },
    {
      title: t("Nav.instructors"),
      links: [
        { label: t("Footer.become_instructor"), href: "#" },
        { label: t("Footer.teaching_resources"), href: "#" },
        { label: t("Footer.instructor_community"), href: "#" },
      ],
    },
    {
      title: t("Nav.support"),
      links: [
        { label: t("Footer.help_center"), href: "/help" },
        { label: t("Footer.contact"), href: "/support" },
        { label: t("Footer.privacy_policy"), href: "#" },
        { label: t("Footer.terms_of_use"), href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, label: t("Common.facebook"), href: "#" },
    { icon: FaLinkedinIn, label: t("Common.linkedin"), href: "#" },
    { icon: FaYoutube, label: t("Common.youtube"), href: "#" },
    { icon: Send, label: t("Common.telegram"), href: "#" },
  ];

  return (
    <footer className="border-t border-brand-border bg-brand-bg2">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-amber">
                <BookOpen className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-sora text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                NexLearn
              </span>
            </Link>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("Footer.description")}
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
          {footerLinks.map(({ title, links }) => (
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
            {t("Footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              {t("Footer.privacy_policy")}
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              {t("Footer.terms")}
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-brand-amber2 no-underline transition-colors">
              {t("Footer.cookie")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
