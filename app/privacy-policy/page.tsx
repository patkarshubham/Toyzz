export const metadata = {
  title: "Privacy Policy | PineToyzz",
  description:
    "PineToyzz Privacy Policy explains how we collect, use, store, and protect customer data.",
};

const policyPoints = [
  {
    title: "Information We Collect",
    items: [
      "Name, email, phone number, and shipping address for order processing.",
      "Payment transaction references from payment partners (we do not store full card details).",
      "Usage data like device/browser type and pages visited to improve site performance.",
    ],
  },
  {
    title: "How We Use Information",
    items: [
      "To confirm orders, deliver products, and share shipping updates.",
      "To support returns, refunds, and customer service requests.",
      "To improve shopping flow, product discovery, and checkout experience.",
    ],
  },
  {
    title: "Data Sharing",
    items: [
      "We only share necessary details with logistics and payment providers.",
      "We do not sell personal information to third parties.",
      "We may disclose data if legally required by law or government authority.",
    ],
  },
  {
    title: "Data Protection",
    items: [
      "We use reasonable administrative and technical safeguards to protect data.",
      "Access to customer data is limited to authorized team members.",
      "No system is 100% risk-free, but we continuously improve security controls.",
    ],
  },
  {
    title: "Cookies",
    items: [
      "Cookies help remember cart preferences and improve browsing performance.",
      "You can disable cookies in your browser settings, but some features may be limited.",
    ],
  },
  {
    title: "Your Rights",
    items: [
      "You may request correction or deletion of your personal data.",
      "You may opt out of non-essential marketing communication anytime.",
      "For requests, contact: support@pinetoyzz.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-16">
      <section className="rounded-3xl border border-[#e8d6bf] bg-[#fff9f2] p-8 md:p-10">
        <p className="mb-3 inline-block rounded-full bg-[#efdbc5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
          Legal
        </p>
        <h1 className="text-4xl font-black text-slate-900 md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
          This Privacy Policy explains how PineToyzz collects, uses, and protects
          customer information when you browse, shop, and place orders on our
          website.
        </p>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Effective Date: February 24, 2026
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {policyPoints.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-[#e8d6bf] bg-white p-6"
          >
            <h2 className="text-xl font-extrabold text-[#8a4f2b]">
              {section.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-[#e8d6bf] bg-[#fff9f2] p-6">
        <h2 className="text-xl font-extrabold text-slate-900">Contact</h2>
        <p className="mt-2 text-sm text-slate-700">
          For any privacy-related request, contact us at
          <span className="font-semibold text-[#8a4f2b]"> support@pinetoyzz.com</span>.
        </p>
      </section>
    </main>
  );
}
