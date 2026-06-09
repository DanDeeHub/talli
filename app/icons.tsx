// Inline SVG icons (Material Symbols paths, 24x24 viewBox — centered, no font bearing).

type IconProps = { className?: string };

function Svg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M5 19V5h6v14zm14 0h-6v-7h6zm0-9h-6V5h6z" />
    </Svg>
  );
}

export function InventoryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2m-1 18H5V9h14zm1-13H4V4h16z" />
      <path d="M9 12h6v2H9z" />
    </Svg>
  );
}

export function WarehouseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 8.35V19h-2v-8H6v8H4V8.35l8-3.2zM22 21V7L12 3 2 7v14h6v-8h8v8zm-11-2H9v2h2zm2-3h-2v2h2zm2 3h-2v2h2z" />
    </Svg>
  );
}

export function SuppliersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zm-.5 1.5 1.96 2.5H17V9.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
    </Svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </Svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12C4.42 15.34 5.17 15 6 15c1.66 0 3 1.34 3 3m4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2" />
    </Svg>
  );
}
