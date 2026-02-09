"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useForm } from "react-hook-form";
import { Instagram, Facebook, Youtube, Phone, Mail, Copy } from "lucide-react";
import { SnapchatIcon, TikTokIcon, XIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui";

interface SocialsFormData {
  instagram: string;
  snapchat: string;
  tiktok: string;
  x: string;
  facebook: string;
  phone: string;
  email: string;
  youtube: string;
}

export function SocialsForm() {
  const { t } = useTranslation();
  const socialsT = t("socials");

  const { register, handleSubmit } = useForm<SocialsFormData>({
    defaultValues: {
      instagram: "",
      snapchat: "",
      tiktok: "",
      x: "",
      facebook: "",
      phone: "",
      email: "",
      youtube: "",
    },
  });

  const onSubmit = (data: SocialsFormData) => {
    console.log("Socials form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-2xl border border-grey-200 bg-white p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2">
          {/* Social Media Accounts - Right column in RTL */}
          <div>
            <h3 className="mb-8 text-right text-lg font-normal text-text-dark">
              {socialsT.socialAccounts}
            </h3>
            <div className="space-y-5">
              <FormField
                label={socialsT.instagram}
                placeholder={socialsT.enterAccountLink}
                icon={<Instagram className="h-5 w-5 text-grey-400" />}
                {...register("instagram")}
              />
              <FormField
                label={socialsT.snapchat}
                placeholder={socialsT.enterAccountLink}
                icon={<SnapchatIcon className="h-5 w-5 text-grey-400" />}
                {...register("snapchat")}
              />
              <FormField
                label={socialsT.tiktok}
                placeholder={socialsT.enterAccountLink}
                icon={<TikTokIcon className="h-5 w-5 text-grey-400" />}
                {...register("tiktok")}
              />
              <FormField
                label={socialsT.x}
                placeholder={socialsT.enterAccountLink}
                icon={<XIcon className="h-5 w-5 text-grey-400" />}
                {...register("x")}
              />
              <FormField
                label={socialsT.facebook}
                placeholder={socialsT.enterAccountLink}
                icon={<Facebook className="h-5 w-5 text-grey-400" />}
                {...register("facebook")}
              />
            </div>
          </div>

          {/* Website Contact Info - Left column in RTL */}
          <div>
            <h3 className="mb-8 text-right text-lg font-normal text-text-dark">
              {socialsT.contactInfo}
            </h3>
            <div className="space-y-5">
              <FormField
                label={socialsT.phoneNumber}
                placeholder={socialsT.enterPhoneNumber}
                icon={<Phone className="h-5 w-5 text-grey-400" />}
                dir="rtl"
                {...register("phone")}
              />
              <FormField
                label={socialsT.email}
                placeholder={socialsT.enterEmail}
                icon={<Mail className="h-5 w-5 text-grey-400" />}
                {...register("email")}
              />
              <FormField
                label={socialsT.youtube}
                placeholder={socialsT.enterChannelLink}
                icon={<Youtube className="h-5 w-5 text-grey-400" />}
                {...register("youtube")}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full font-light! rounded-[20px]!"
            size="lg"
          >
            {socialsT.save}
          </Button>
        </div>
      </div>
    </form>
  );
}

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon, ...props }, ref) => {
    return (
      <div>
        <label className="mb-3 block text-lg font-normal text-text-dark">
          {label}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3">
            {icon}
          </div>
          <input
            ref={ref}
            className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            {...props}
          />
        </div>
      </div>
    );
  },
);

FormField.displayName = "FormField";
