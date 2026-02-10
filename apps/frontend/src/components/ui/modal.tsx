'use client';

import React from 'react';
import { Modal as HeroModal } from '@heroui/react';

export function Modal({
  isOpen,
  onOpenChange,
  placement,
  size,
  closeTrigger,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full';
  placement?: 'auto' | 'center' | 'top' | 'bottom';
  closeTrigger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <HeroModal isOpen={isOpen} onOpenChange={onOpenChange}>
      <HeroModal.Backdrop>
        <HeroModal.Container placement={placement ?? 'auto'} size={size}>
          <HeroModal.Dialog>
            {closeTrigger ? <HeroModal.CloseTrigger className="size-8" /> : null}
            {children}
          </HeroModal.Dialog>
        </HeroModal.Container>
      </HeroModal.Backdrop>
    </HeroModal>
  );
}
