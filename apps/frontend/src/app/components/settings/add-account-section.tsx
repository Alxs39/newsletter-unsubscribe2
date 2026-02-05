'use client';

import ImapForm from '../providers/imap-form';

export default function AddAccountSection() {
  return (
    <section>
      <h3 className="mb-3 font-medium">Add New Account</h3>
      <ImapForm />
    </section>
  );
}
