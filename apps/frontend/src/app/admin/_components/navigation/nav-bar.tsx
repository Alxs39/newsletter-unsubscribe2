'use client';

import { Link } from '@heroui/react';
import { cva } from 'class-variance-authority';
import { usePathname } from 'next/navigation';

export default function AdminNavigationNavBar() {
  const pathname = usePathname();

  const items = [
    {
      label: 'Dashboard',
      href: '/admin',
    },
    {
      label: 'Users',
      href: '/admin/users',
    },
    {
      label: 'IMAPs',
      href: '/admin/imaps',
    },
  ];

  function isActive(href: string) {
    return pathname === href;
  }

  const itemClass = cva('p-2 rounded-lg min-h-9 w-full hover:underline hover:underline-offset-4', {
    variants: {
      active: {
        true: 'bg-neutral-200',
        false: '',
      },
    },
  });

  return (
    <nav className="h-full">
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href} className={itemClass({ active: isActive(item.href) })}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
