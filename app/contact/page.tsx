import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | PineToyzz",
  description:
    "Contact PineToyzz for orders, delivery queries, bulk purchase support, and product guidance.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-16">
      <section className="rounded-3xl border border-[#e8d6bf] bg-[radial-gradient(circle_at_10%_20%,#f6eadc_0%,transparent_35%),#fff9f2] p-8 md:p-10">
        <p className="mb-3 inline-block rounded-full bg-[#efdbc5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
          PineToyzz Support
        </p>
        <h1 className="text-4xl font-black text-slate-900 md:text-5xl">Contact Us</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
          Need help with toy selection, order updates, delivery pincode support,
          or bulk gifting? Our team is here to help you quickly.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <aside className="space-y-4">
          <article className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-lg font-extrabold text-[#8a4f2b]">Email</h2>
            <p className="mt-2 text-sm text-slate-700">support@pinetoyzz.com</p>
          </article>

          <article className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-lg font-extrabold text-[#8a4f2b]">Phone</h2>
            <p className="mt-2 text-sm text-slate-700">+91 98765 43210</p>
            <p className="mt-1 text-xs text-slate-500">Mon-Sat, 10:00 AM - 7:00 PM</p>
          </article>

          <article className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-lg font-extrabold text-[#8a4f2b]">Warehouse & Support Desk</h2>
            <p className="mt-2 text-sm text-slate-700">
              PineToyzz, Sector 48, Gurugram, Haryana 122018, India
            </p>
          </article>
        </aside>

        <ContactForm />
      </section>
    </main>
  );
}
