"use client";
import React, { useEffect, useState } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { capitalizeWords } from '@/lib/utils';

interface Breadcrumb {
  key: string;
  label: string;
}

const DynamicBreadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<string>(pathname);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const pathArray = pathname.replace('/dashboard', '').split('/').filter(Boolean);

    const breadcrumbItems = [
      { key: '/dashboard', label: 'Dashboard' },
      ...pathArray.map((segment, index) => {
        const path = `/dashboard/${pathArray.slice(0, index + 1).join('/')}`;
        return {
          key: path,
          label: capitalizeWords(segment.replace(/-/g, ' '))
        }
      })
    ];

    setBreadcrumbs(breadcrumbItems);
    setCurrentPage(pathname);
  }, [pathname]);

  return (
    <Breadcrumbs underline="active" onAction={(key) => router.push(key as string)}>
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem
          key={breadcrumb.key}
          isCurrent={currentPage === breadcrumb.key}
        >
          {breadcrumb.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;