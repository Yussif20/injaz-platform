import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SnapchatIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C9.5 2 7.5 4 7.5 6.5v2c-1 .2-2.5.5-3 1.5-.3.6 0 1.2.5 1.5l1 .5c-0.5 1.5-1.5 2.5-3 3 .5 1 2 1.5 3 1.5 0 1 .5 2 1 2.5 1 1 3 1 4.5 1s3.5 0 4.5-1c.5-.5 1-1.5 1-2.5 1 0 2.5-.5 3-1.5-1.5-.5-2.5-1.5-3-3l1-.5c.5-.3.8-.9.5-1.5-.5-1-2-1.3-3-1.5v-2C16.5 4 14.5 2 12 2z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.5L19.5 4h-2l-5 6.2L8 4H4z" />
    </svg>
  );
}
