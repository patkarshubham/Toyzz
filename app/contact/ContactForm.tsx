"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section className="rounded-3xl border border-[#e8d6bf] bg-white p-5 md:p-6">
      <h2 className="text-2xl font-black text-slate-900">Send Us a Message</h2>
      <p className="mt-2 text-sm text-slate-600">
        Share your requirement and we will get back to you as soon as possible.
      </p>

      <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Full name *"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, subject: event.target.value }))
            }
            className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />
        </div>

        <textarea
          rows={5}
          placeholder="Message *"
          value={form.message}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, message: event.target.value }))
          }
          className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
        />

        <button className="w-fit rounded-full bg-[#8a4f2b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#704123]">
          Submit Inquiry
        </button>

        {sent && (
          <p className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
            Message sent successfully. Our team will contact you shortly.
          </p>
        )}
      </form>
    </section>
  );
}
