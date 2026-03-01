export const metadata = {
  title: "Terms and Conditions | PineToyzz",
  description:
    "Read PineToyzz terms and conditions for website usage, orders, shipping, returns, payments, and customer responsibilities.",
};

const sections = [
  {
    title: "1. Scope of Terms",
    content:
      "These Terms and Conditions apply to your use of PineToyzz website and purchase of handcrafted pine wood toys. By using this site, you agree to these terms.",
  },
  {
    title: "2. Eligibility and Account Information",
    content:
      "You agree to provide accurate contact, address, and payment details. PineToyzz may cancel or hold orders if information appears incomplete, invalid, or suspicious.",
  },
  {
    title: "3. Product Details and Pricing",
    content:
      "We make every effort to keep product details, MRP, offer price, stock, and images accurate. Since products are handcrafted from natural pine wood, slight variation in wood grain or finish may occur.",
  },
  {
    title: "4. Orders and Payment",
    content:
      "Order confirmation is provided only after successful payment authorization. In case of technical failure or payment reversal, PineToyzz may void the order and initiate refund as applicable.",
  },
  {
    title: "5. Shipping and Delivery",
    content:
      "Delivery is based on pincode serviceability and logistics coverage. Timelines shown are estimated. Delays may happen due to weather, transport restrictions, or other events outside our control.",
  },
  {
    title: "6. Returns, Replacements, and Refunds",
    content:
      "Return/replacement requests must be raised within the policy window and with required proof (such as images or unboxing evidence when needed). Approved refunds are processed to the original payment method based on banking timelines.",
  },
  {
    title: "7. Safety and Product Usage",
    content:
      "Our toys are designed with child-safe finishes and rounded edges, but adult supervision is recommended for younger children. Please follow age guidance and usage instructions on each product page.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "All content on this website, including brand name, logo, designs, images, product descriptions, and layout, is owned by PineToyzz and cannot be copied, reused, or distributed without written permission.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "PineToyzz is not liable for indirect, incidental, or consequential losses arising from website downtime, delayed delivery, third-party logistics/payment issues, or misuse of products.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may revise these terms at any time. Updated terms become effective upon publication on this page. Continued use of the website indicates acceptance of the revised terms.",
  },
  {
    title: "11. Governing Law",
    content:
      "These terms are governed by the laws of India. Any disputes shall be subject to jurisdiction of competent courts in Gurugram, Haryana.",
  },
  {
    title: "12. Contact Us",
    content: "For any terms-related query, write to support@pinetoyzz.com.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-16">
      <section className="rounded-3xl border border-[#e8d6bf] bg-[#fff9f2] p-8 md:p-10">
        <p className="mb-3 inline-block rounded-full bg-[#efdbc5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
          Legal
        </p>
        <h1 className="text-slate-900 text-4xl font-black md:text-5xl">
          Terms and Conditions
        </h1>
        <p className="text-slate-700 mt-4 max-w-3xl text-sm leading-relaxed md:text-base">
          Please read these Terms and Conditions carefully before using
          PineToyzz. They define your rights and responsibilities while shopping
          on our platform.
        </p>
        <p className="text-slate-500 mt-3 text-xs font-semibold">
          Effective Date: February 24, 2026
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-[#e8d6bf] bg-white p-6"
          >
            <h2 className="text-xl font-extrabold text-[#8a4f2b]">
              {section.title}
            </h2>
            <p className="text-slate-700 mt-2 text-sm leading-relaxed">
              {section.content}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
