import React, { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useToast } from "../components/Toast.jsx";

/**
 * DEMO SUBMISSION ONLY.
 * This form does not call a backend email service. It simulates a short
 * delay and shows a success state so the full UI flow can be reviewed.
 * To make this real, POST `form` to a backend route that sends email
 * (e.g. via SMTP or a provider like SendGrid/Postmark) and swap the
 * setTimeout below for that request.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) nextErrors.message = "Message should be at least 10 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    // DEMO: no backend email service is configured. See file header.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      toast("Message received (demo mode) — no email service is connected yet.", "info");
    }, 900);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-ink-soft">
          Questions, feedback, or ideas for Signify? Send a message below.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                <Send size={20} />
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">Message received</h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-soft">
                This is a demo submission — no email was actually sent. Connect
                a backend email service to make this live.
              </p>
              <Button variant="secondary" size="sm" className="mt-6" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input label="Name" value={form.name} onChange={update("name")} error={errors.name} />
              <Input label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  className="w-full rounded-xl surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
              </div>
              <Button type="submit" icon={Send} loading={submitting} className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2 text-brand-600">
              <Mail size={18} />
              <h3 className="font-display text-sm font-semibold text-ink">Email</h3>
            </div>
            <p className="text-sm text-ink-soft">hello@signify.example</p>
          </Card>
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2 text-brand-600">
              <MessageSquare size={18} />
              <h3 className="font-display text-sm font-semibold text-ink">Response time</h3>
            </div>
            <p className="text-sm text-ink-soft">
              This is a student project — replies aren't automated yet.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
