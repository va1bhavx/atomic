import { Breadcrumb, BreadcrumbLink } from "../ui/breadcrumb";

interface DashboardBreadcrumbProps {
  title: string;
  links?: { href: string; label: string }[];
}

export default function DashboardBreadcrumb({
  title,
  links,
}: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbLink href="/dashboard">{title}</BreadcrumbLink>
      {links &&
        links.map((link, index) => (
          <>
            <BreadcrumbLink key={index} href={link.href}>
              {link.label}
              {index !== links.length - 1 && <span key={index}>&gt;</span>}
            </BreadcrumbLink>
          </>
        ))}
    </Breadcrumb>
  );
}
