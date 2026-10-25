import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { GeneratorDraft } from "@/hooks/useGenerator";
import type { QrCategoryId } from "@/lib/qr";
import { QrCode } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { Field, TextAreaField, TextField } from "./fields";

export interface CategoryFormProps {
  draft: GeneratorDraft;
  update: <K extends keyof GeneratorDraft>(
    key: K,
    value: GeneratorDraft[K],
  ) => void;
  error: string | null;
  onGenerate: () => void;
}

function GenerateButton({ onGenerate }: { onGenerate: () => void }) {
  return (
    <Button
      type="button"
      onClick={onGenerate}
      data-ocid="generator.generate_button"
      className="h-12 w-full rounded-full bg-gradient-primary text-base shadow-glow transition-transform hover:scale-[1.02] sm:w-auto sm:px-8"
    >
      <QrCode className="size-4" />
      Generate QR Code
    </Button>
  );
}

function UrlForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  return (
    <>
      <TextField
        id="generator.url"
        label="Website address"
        value={draft.url}
        onChange={(value) => update("url", value)}
        placeholder="https://www.example.com"
        hint="We add https:// automatically if you leave it out."
        error={error}
        required
        type="url"
        inputMode="url"
        autoComplete="url"
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function TextForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  return (
    <>
      <TextAreaField
        id="generator.text"
        label="Text to share"
        value={draft.text}
        onChange={(value) => update("text", value)}
        placeholder="Type any note, code or short message…"
        hint="Plain text is stored directly in the code — keep it concise."
        error={error}
        required
        rows={5}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function WifiForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const wifi = draft.wifi;
  return (
    <>
      <TextField
        id="generator.wifi.ssid"
        label="Network name (SSID)"
        value={wifi.ssid}
        onChange={(value) => update("wifi", { ...wifi, ssid: value })}
        placeholder="Cafe Guest Wi-Fi"
        required
      />
      <Field
        id="generator.wifi.encryption"
        label="Security type"
        hint="Choose None for an open network with no password."
      >
        <Select
          value={wifi.encryption}
          onValueChange={(value) =>
            update("wifi", {
              ...wifi,
              encryption: value as typeof wifi.encryption,
            })
          }
        >
          <SelectTrigger
            id="generator.wifi.encryption"
            data-ocid="generator.wifi.encryption.select"
            className="h-11 w-full rounded-xl border-input bg-background/80"
          >
            <SelectValue placeholder="Select security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">None (open network)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {wifi.encryption !== "nopass" ? (
        <TextField
          id="generator.wifi.password"
          label="Password"
          value={wifi.password}
          onChange={(value) => update("wifi", { ...wifi, password: value })}
          placeholder="Network password"
          required
        />
      ) : null}
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
        <div>
          <Label
            htmlFor="generator.wifi.hidden"
            className="text-sm font-medium text-foreground"
          >
            Hidden network
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable if the SSID is not broadcast.
          </p>
        </div>
        <Switch
          id="generator.wifi.hidden"
          checked={wifi.hidden}
          onCheckedChange={(checked) =>
            update("wifi", { ...wifi, hidden: checked })
          }
          data-ocid="generator.wifi.hidden.switch"
        />
      </div>
      {error ? (
        <p
          role="alert"
          data-ocid="generator.wifi.error_state"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function EmailForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const email = draft.email;
  return (
    <>
      <TextField
        id="generator.email.to"
        label="Recipient address"
        value={email.to}
        onChange={(value) => update("email", { ...email, to: value })}
        placeholder="hello@example.com"
        error={error}
        required
        type="email"
        inputMode="email"
        autoComplete="email"
      />
      <TextField
        id="generator.email.subject"
        label="Subject"
        value={email.subject}
        onChange={(value) => update("email", { ...email, subject: value })}
        placeholder="Question about your services"
      />
      <TextAreaField
        id="generator.email.body"
        label="Message"
        value={email.body}
        onChange={(value) => update("email", { ...email, body: value })}
        placeholder="Write the message you want pre-filled…"
        rows={4}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function PhoneForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  return (
    <>
      <TextField
        id="generator.phone"
        label="Phone number"
        value={draft.phone}
        onChange={(value) => update("phone", value)}
        placeholder="+1 555 010 0199"
        hint="Include the country code so the call works internationally."
        error={error}
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function SmsForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const sms = draft.sms;
  return (
    <>
      <TextField
        id="generator.sms.phone"
        label="Phone number"
        value={sms.phone}
        onChange={(value) => update("sms", { ...sms, phone: value })}
        placeholder="+1 555 010 0199"
        error={error}
        required
        type="tel"
        inputMode="tel"
      />
      <TextAreaField
        id="generator.sms.message"
        label="Message"
        value={sms.message}
        onChange={(value) => update("sms", { ...sms, message: value })}
        placeholder="Hi! I'd like to book an appointment."
        hint="The scanner's messaging app opens with this text ready to send."
        rows={3}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function WhatsAppForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  return (
    <>
      <TextField
        id="generator.whatsapp.phone"
        label="WhatsApp number"
        value={draft.whatsappPhone}
        onChange={(value) => update("whatsappPhone", value)}
        placeholder="+1 555 010 0199"
        hint="Use the full international number with country code."
        error={error}
        required
        type="tel"
        inputMode="tel"
      />
      <TextAreaField
        id="generator.whatsapp.message"
        label="Pre-filled message (optional)"
        value={draft.whatsappMessage}
        onChange={(value) => update("whatsappMessage", value)}
        placeholder="Hi! I saw your QR code and wanted to chat."
        rows={3}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function ContactForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const contact = draft.contact;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="generator.contact.firstName"
          label="First name"
          value={contact.firstName}
          onChange={(value) =>
            update("contact", { ...contact, firstName: value })
          }
          placeholder="Ada"
          error={error}
        />
        <TextField
          id="generator.contact.lastName"
          label="Last name"
          value={contact.lastName}
          onChange={(value) =>
            update("contact", { ...contact, lastName: value })
          }
          placeholder="Lovelace"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="generator.contact.organization"
          label="Company"
          value={contact.organization}
          onChange={(value) =>
            update("contact", { ...contact, organization: value })
          }
          placeholder="Analytical Engines Ltd."
        />
        <TextField
          id="generator.contact.title"
          label="Job title"
          value={contact.title}
          onChange={(value) => update("contact", { ...contact, title: value })}
          placeholder="Lead Engineer"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="generator.contact.phone"
          label="Phone"
          value={contact.phone}
          onChange={(value) => update("contact", { ...contact, phone: value })}
          placeholder="+1 555 010 0199"
          type="tel"
          inputMode="tel"
        />
        <TextField
          id="generator.contact.email"
          label="Email"
          value={contact.email}
          onChange={(value) => update("contact", { ...contact, email: value })}
          placeholder="ada@example.com"
          type="email"
          inputMode="email"
        />
      </div>
      <TextField
        id="generator.contact.website"
        label="Website"
        value={contact.website}
        onChange={(value) => update("contact", { ...contact, website: value })}
        placeholder="example.com"
        type="url"
        inputMode="url"
      />
      <TextField
        id="generator.contact.address"
        label="Address"
        value={contact.address}
        onChange={(value) => update("contact", { ...contact, address: value })}
        placeholder="12 Analytical Way, London"
      />
      <TextAreaField
        id="generator.contact.note"
        label="Note"
        value={contact.note}
        onChange={(value) => update("contact", { ...contact, note: value })}
        placeholder="Met at the design conference."
        rows={2}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function LocationForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const location = draft.location;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="generator.location.latitude"
          label="Latitude"
          value={location.latitude}
          onChange={(value) =>
            update("location", { ...location, latitude: value })
          }
          placeholder="51.5074"
          error={error}
          required
          inputMode="decimal"
        />
        <TextField
          id="generator.location.longitude"
          label="Longitude"
          value={location.longitude}
          onChange={(value) =>
            update("location", { ...location, longitude: value })
          }
          placeholder="-0.1278"
          required
          inputMode="decimal"
        />
      </div>
      <TextField
        id="generator.location.label"
        label="Place label (optional)"
        value={location.label}
        onChange={(value) => update("location", { ...location, label: value })}
        placeholder="QRNova Studio"
        hint="A short name shown alongside the map pin."
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X (Twitter)" },
  { value: "other", label: "Other / custom URL" },
];

function SocialForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const social = draft.social;
  const isCustom = social.platform === "other";
  return (
    <>
      <Field id="generator.social.platform" label="Platform">
        <Select
          value={social.platform}
          onValueChange={(value) =>
            update("social", { ...social, platform: value })
          }
        >
          <SelectTrigger
            id="generator.social.platform"
            data-ocid="generator.social.platform.select"
            className="h-11 w-full rounded-xl border-input bg-background/80"
          >
            <SelectValue placeholder="Choose a platform" />
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_PLATFORMS.map((platform) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <TextField
        id="generator.social.handle"
        label={isCustom ? "Profile URL" : "Username or handle"}
        value={social.handle}
        onChange={(value) => update("social", { ...social, handle: value })}
        placeholder={isCustom ? "https://example.com/me" : "@yourhandle"}
        hint={
          isCustom
            ? "Paste the full link to your profile."
            : "Enter your handle with or without the @ symbol."
        }
        error={error}
        required
        type={isCustom ? "url" : "text"}
        inputMode={isCustom ? "url" : "text"}
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function PdfForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  return (
    <>
      <TextField
        id="generator.pdf.url"
        label="Public PDF or document URL"
        value={draft.pdfUrl}
        onChange={(value) => update("pdfUrl", value)}
        placeholder="https://example.com/menu.pdf"
        hint="The code links to the hosted file — it does not contain the PDF itself. Make sure the link is publicly accessible."
        error={error}
        required
        type="url"
        inputMode="url"
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function EventForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const event = draft.event;
  return (
    <>
      <TextField
        id="generator.event.title"
        label="Event title"
        value={event.title}
        onChange={(value) => update("event", { ...event, title: value })}
        placeholder="Product launch party"
        error={error}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="generator.event.start"
          label="Starts"
          value={event.start}
          onChange={(value) => update("event", { ...event, start: value })}
          type="datetime-local"
          required
        />
        <TextField
          id="generator.event.end"
          label="Ends"
          value={event.end}
          onChange={(value) => update("event", { ...event, end: value })}
          type="datetime-local"
        />
      </div>
      <TextField
        id="generator.event.location"
        label="Location"
        value={event.location}
        onChange={(value) => update("event", { ...event, location: value })}
        placeholder="The Grand Hall, London"
      />
      <TextField
        id="generator.event.link"
        label="Event link (optional)"
        value={event.url ?? ""}
        onChange={(value) => update("event", { ...event, url: value })}
        placeholder="https://example.com/rsvp"
        hint="Added to the calendar entry as a link so guests can find more details."
        type="url"
        inputMode="url"
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

function AppForm({ draft, update, error, onGenerate }: CategoryFormProps) {
  const app = draft.app;
  const [store, setStore] = useState<"ios" | "android">("ios");
  return (
    <>
      <Field
        id="generator.app.store"
        label="Primary store"
        hint="Pick the store to feature first; both links are encoded when provided."
      >
        <Select
          value={store}
          onValueChange={(value) => setStore(value as "ios" | "android")}
        >
          <SelectTrigger
            id="generator.app.store"
            data-ocid="generator.app.store.select"
            className="h-11 w-full rounded-xl border-input bg-background/80"
          >
            <SelectValue placeholder="Choose a store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ios">App Store (iOS)</SelectItem>
            <SelectItem value="android">Google Play (Android)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {store === "ios" ? (
        <TextField
          id="generator.app.ios"
          label="App Store URL"
          value={app.iosUrl}
          onChange={(value) => update("app", { ...app, iosUrl: value })}
          placeholder="https://apps.apple.com/app/id000000000"
          required
          type="url"
          inputMode="url"
        />
      ) : (
        <TextField
          id="generator.app.android"
          label="Google Play URL"
          value={app.androidUrl}
          onChange={(value) => update("app", { ...app, androidUrl: value })}
          placeholder="https://play.google.com/store/apps/details?id=com.example"
          required
          type="url"
          inputMode="url"
        />
      )}
      <TextField
        id="generator.app.fallback"
        label="Fallback link (optional)"
        value={app.fallbackUrl}
        onChange={(value) => update("app", { ...app, fallbackUrl: value })}
        placeholder="https://example.com/download"
        hint="Used when the scanner's device is not a phone."
        error={error}
        type="url"
        inputMode="url"
      />
      <GenerateButton onGenerate={onGenerate} />
    </>
  );
}

const FORMS: Record<QrCategoryId, (props: CategoryFormProps) => ReactElement> =
  {
    url: UrlForm,
    text: TextForm,
    wifi: WifiForm,
    email: EmailForm,
    phone: PhoneForm,
    sms: SmsForm,
    whatsapp: WhatsAppForm,
    contact: ContactForm,
    location: LocationForm,
    social: SocialForm,
    pdf: PdfForm,
    event: EventForm,
    app: AppForm,
  };

/** Renders the form matching the selected category. */
export function CategoryForm(
  props: CategoryFormProps & { category: QrCategoryId },
) {
  const { category, ...rest } = props;
  const Form = FORMS[category];
  return (
    <div className="space-y-5">
      <Form {...rest} />
    </div>
  );
}
