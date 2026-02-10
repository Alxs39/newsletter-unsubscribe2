'use client';

import {
  Alert,
  Button,
  Checkbox,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@/hooks/useMutation';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';
import { Modal as HeroModal } from '@heroui/react';

type ImapConfigFields = 'name' | 'host' | 'port' | 'useSsl';

export default function FormImapConfig({
  onSuccess,
  config,
}: {
  onSuccess?: () => void;
  config?: ImapConfigDto;
} = {}) {
  const [name, setName] = useState(config?.name ?? '');
  const [host, setHost] = useState(config?.host ?? '');
  const [port, setPort] = useState(String(config?.port ?? 993));
  const [useSsl, setUseSsl] = useState(config?.useSsl ?? true);
  const { mutate, isLoading, isError, getFieldError, reset } = useMutation<
    ImapConfigDto,
    { name: string; host: string; port: number; useSsl: boolean },
    ImapConfigFields
  >({
    url: config ? `/admin/imap-configs/${config.id}` : '/admin/imap-configs',
    method: config ? 'PATCH' : 'POST',
    onSuccess: () => {
      setName('');
      setHost('');
      setPort('993');
      setUseSsl(true);
      onSuccess?.();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    await mutate({ name, host, port: Number(port), useSsl });
  }

  const ariaConfig = {
    ariaLabel: config ? 'Edit IMAP Configuration' : 'Add IMAP Configuration',
    ariaDescribedby: config ? 'edit-imap-config-description' : 'add-imap-config-description',
    ariaLabelledby: config ? 'edit-imap-config-title' : 'add-imap-config-title',
  };
  const headingText = config ? 'Edit IMAP Configuration' : 'Add IMAP Configuration';
  const descriptionText = config
    ? 'Update the IMAP configuration by modifying the form below.'
    : 'Create a new IMAP configuration by filling out the form below.';

  return (
    <>
      <HeroModal.Header
        aria-label={ariaConfig.ariaLabel}
        aria-describedby={ariaConfig.ariaDescribedby}
        aria-labelledby={ariaConfig.ariaLabelledby}
      >
        <HeroModal.Heading id={ariaConfig.ariaLabelledby}>{headingText}</HeroModal.Heading>
        <p id={ariaConfig.ariaDescribedby} className="text-foreground">
          {descriptionText}
        </p>
      </HeroModal.Header>
      <HeroModal.Body>
        <Form onSubmit={(e) => void handleSubmit(e)}>
          <Fieldset className="p-1">
            {isError && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Failed to create IMAP configuration.</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            <FieldGroup>
              <TextField
                name="name"
                value={name}
                onChange={setName}
                isInvalid={!!getFieldError('name')}
              >
                <Label>Name</Label>
                <Input placeholder="Gmail" />
                <FieldError>{getFieldError('name')}</FieldError>
              </TextField>
              <TextField
                name="host"
                value={host}
                onChange={setHost}
                isInvalid={!!getFieldError('host')}
              >
                <Label>Host</Label>
                <Input placeholder="imap.gmail.com" />
                <FieldError>{getFieldError('host')}</FieldError>
              </TextField>
              <TextField
                name="port"
                value={port}
                onChange={setPort}
                isInvalid={!!getFieldError('port')}
              >
                <Label>Port</Label>
                <Input placeholder="993" />
                <FieldError>{getFieldError('port')}</FieldError>
              </TextField>
              <div className="flex items-center gap-2">
                <Checkbox id="ssl" isSelected={useSsl} onChange={setUseSsl}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
                <Label htmlFor="ssl">Use SSL</Label>
              </div>
            </FieldGroup>
            <Fieldset.Actions>
              <Button variant="tertiary" type="submit" isPending={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {config ? 'Saving...' : 'Adding...'}
                  </>
                ) : config ? (
                  'Save Changes'
                ) : (
                  'Add Configuration'
                )}
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </HeroModal.Body>
    </>
  );
}
