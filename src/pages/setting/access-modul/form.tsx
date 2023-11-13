import AccessModulTransferList, { TransferListDataType } from '@/components/AccessModulTransferList';
import AdminLayout from '@/components/layout/AdminLayout';
import { AccessModulRepository } from '@/features/setting/access-modul/access-modul.repository';
import { RoleRepository } from '@/features/setting/role/role.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Modul">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      role: '',
      code: '',
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;
  const { data: dataAccessModul, isLoading: isLoadingAccessModul } =
    AccessModulRepository.hooks.useSelectedUnselectedAccess(id as string | undefined);
  const [data, setData] = useState<[TransferListDataType[], TransferListDataType[]]>([[], []]);
  const { data: dataRole } = RoleRepository.hooks.useById(id as string | undefined);

  const handleTransfer = (transferFrom: number, options: TransferListDataType[]) => {
    return setData((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0;
      const transferFromData = current[transferFrom].filter((item) => !options.includes(item));
      const transferToData = [...current[transferTo], ...options];

      const result = [];
      result[transferFrom] = transferFromData;
      result[transferTo] = transferToData;
      return result as [TransferListDataType[], TransferListDataType[]];
    });
  };

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (!dataAccessModul) return;
      const [, selectedAccess] = data;
      const mappingBody = selectedAccess.map((item) => {
        const [categoryModulId, modulId] = item.value.split('-');
        return {
          categoryModulId: parseInt(categoryModulId),
          modulId: parseInt(modulId),
          roleId: parseInt(id as string),
        };
      });

      console.log({ data });

      const result = await AccessModulRepository.api.updateAccess({ values: mappingBody });

      notifications.show({
        title: 'Success',
        message: result.message,
        color: 'green',
      });

      back();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (dataAccessModul) {
      // set field value

      if (dataRole) {
        setFieldValue('role', dataRole.name);
        setFieldValue('code', dataRole.code);
      }

      const { selected: selectedAccessModul = [], unselected: unselectedAccessModul = [] } = dataAccessModul || {};

      const mappingSelectedAccessModul: TransferListDataType[] = selectedAccessModul.map((item) => {
        // Value combination of categoryModulId and modulId with delimiter '-'
        const value = `${item.categoryModulId}-${item.modulId}`;
        return {
          value,
          label: item.name,
        };
      });

      const mappingUnselectedAccessModul: TransferListDataType[] = unselectedAccessModul.map((item) => {
        const value = `${item.categoryModulId}-${item.modulId}`;
        return {
          value,
          label: item.name,
        };
      });
      //   setData([mappingUnselectedAccessModul, mappingSelectedAccessModul]);
      setData([mappingUnselectedAccessModul, mappingSelectedAccessModul]);
    }

    return () => {};
  }, [dataAccessModul, dataRole, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingAccessModul} />
        <Stack gap={'xl'}>
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
              <Button type="submit">Simpan</Button>
            </Group>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Form
            </Card.Section>
            <Stack gap={'md'}>
              <TextInput placeholder="Your role" label="Role" disabled {...form.getInputProps('role')} />
              <TextInput placeholder="Your code" label="Code" disabled {...form.getInputProps('code')} />
              <Group align="center" style={{ marginTop: 10, marginBottom: 10 }}>
                <Stack gap={'md'}>
                  <div className="font-semibold">Unselected Access</div>
                  <AccessModulTransferList
                    options={data[0]}
                    type="forward"
                    onTransfer={(val) => handleTransfer(0, val)}
                  />
                </Stack>
                <Stack gap={'md'}>
                  <div className="font-semibold">Selected Access</div>
                  <AccessModulTransferList
                    options={data[1]}
                    type="backward"
                    onTransfer={(val) => handleTransfer(1, val)}
                  />
                </Stack>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
