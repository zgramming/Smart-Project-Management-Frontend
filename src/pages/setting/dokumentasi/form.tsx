import AdminLayout from '@/components/layout/AdminLayout';
import { DokumentasiRepository } from '@/features/setting/dokumentasi/dokumentasi.repository';
import { CreateDokumentasiDto } from '@/features/setting/dokumentasi/dto/create-dokumentasi.dto';
import { UpdateDokumentasiDto } from '@/features/setting/dokumentasi/dto/update-dokumentasi.dto';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, NumberInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export default function Page() {
  const { back, query } = useRouter();
  const { id, action } = query;
  const form = useForm({
    initialValues: {
      title: '',
      discount_percentage: 0,
      rating: 0,
      stock: 0,
      price: 0,
      description: '',
    },
    validate: {
      title: (value: string) => {
        if (!value) {
          return 'Title harus diisi';
        }
        return null;
      },
    },
  });

  const { data: detailProduct, isLoading } = DokumentasiRepository.hooks.useDetailProduct(id as string | undefined);

  const { setFieldValue } = form;

  useEffect(() => {
    if (detailProduct) {
      setFieldValue('title', detailProduct.title);
      setFieldValue('discount_percentage', detailProduct.discountPercentage);
      setFieldValue('rating', detailProduct.rating);
      setFieldValue('stock', detailProduct.stock);
      setFieldValue('price', detailProduct.price);
      setFieldValue('description', detailProduct.description);
    }
    return () => {};
  }, [detailProduct, setFieldValue]);

  const onSubmit = async (values: any) => {
    const isEdit = action === 'edit' && detailProduct;
    const form: CreateDokumentasiDto = {
      description: values.description,
      discountPercentage: values.discount_percentage,
      rating: values.rating,
      stock: values.stock,
      title: values.title,
      price: values.price,
    };

    try {
      let message = '';

      if (isEdit) {
        const updateForm: UpdateDokumentasiDto = {
          ...form,
        };
        await DokumentasiRepository.api.update(detailProduct?.id as number, updateForm);
        message = `Berhasil mengubah data`;
      } else {
        await DokumentasiRepository.api.create(form);
        message = `Berhasil menambah data`;
      }

      notifications.show({
        title: 'Berhasil',
        message,
        color: 'green',
      });
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Gagal',
        message,
        color: 'red',
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
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
              <TextInput label="Title" placeholder="Title" {...form.getInputProps('title')} />
              <NumberInput
                label="Discount Percentage"
                placeholder="Discount Percentage"
                thousandSeparator=","
                {...form.getInputProps('discount_percentage')}
              />
              <NumberInput
                label="Rating"
                placeholder="Rating"
                thousandSeparator=","
                step={0.01}
                decimalScale={2}
                {...form.getInputProps('rating')}
              />
              <NumberInput label="Stock" placeholder="Stock" thousandSeparator="," {...form.getInputProps('stock')} />
              <NumberInput
                label="Price"
                placeholder="Price"
                thousandSeparator=","
                step={0.01}
                decimalScale={2}
                {...form.getInputProps('price')}
              />
              <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} />
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Dokumentasi">{page}</AdminLayout>;
