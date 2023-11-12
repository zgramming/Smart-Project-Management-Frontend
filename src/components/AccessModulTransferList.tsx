import { ActionIcon, Checkbox, Combobox, Group, TextInput, useCombobox } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';

import classes from '@cssModule/access_modul_transfer_list.module.css';

export type TransferListDataType = {
  value: string ;
  label: string;
};

interface AccessModulTransferListProps {
  options: TransferListDataType[];
  // eslint-disable-next-line no-unused-vars
  onTransfer(options: TransferListDataType[]): void;
  type: 'forward' | 'backward';
}

function AccessModulTransferList({ options, onTransfer, type }: AccessModulTransferListProps) {
  const combobox = useCombobox();
  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const handleValueSelect = (val: string) =>
    setValue((current) => (current.includes(val) ? current.filter((v) => v !== val) : [...current, val]));

  const items = options
    .filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={value.includes(item.label)}
        onMouseOver={() => combobox.resetSelectedOption()}
      >
        <Group gap="sm">
          <Checkbox
            checked={value.includes(item.value)}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: 'none' }}
          />
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <div className={classes.renderList} data-type={type}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.EventsTarget>
          <Group wrap="nowrap" gap={0} className={`${classes.controls} ${classes.datatransfer}`}>
            <TextInput
              placeholder="Search for item"
              classNames={{ input: `${classes.input} ${classes.datatransfer}` }}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                combobox.updateSelectedOptionIndex();
              }}
            />
            <ActionIcon
              radius={0}
              variant="default"
              size={36}
              className={`${classes.control} ${classes.datatransfer}`}
              onClick={() => {
                onTransfer(options.filter((item) => value.includes(item.value)));
                setValue([]);
              }}
            >
              <IconChevronRight className={`${classes.icon} ${classes.datatransfer}`} />
            </ActionIcon>
          </Group>
        </Combobox.EventsTarget>

        <div className={classes.list}>
          <Combobox.Options>
            {items.length > 0 ? items : <Combobox.Empty>Nothing found....</Combobox.Empty>}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}

export default AccessModulTransferList;
