import { IDokumentasi } from '@/features/setting/dokumentasi/entities/dokumentasi.entity';
import { IDokumentasiDetail } from '@/features/setting/dokumentasi/entities/dokumentasi_detail.entity';
import { http } from '@/utils/http';
import useSWR from 'swr';
import { CreateDokumentasiDto } from './dto/create-dokumentasi.dto';
import { UpdateDokumentasiDto } from './dto/update-dokumentasi.dto';

// Dokumentasi use dummy rest api with url : https://dummyjson.com/docs/products

type useListProduct = {
  skip: number;
  limit: number;
  query?: string;
};

const url = {
  base: '/products',
  baseWithSearch: '/products/search',
};
const hooks = {
  useListProduct: ({ skip, limit, query }: useListProduct) => {
    let uri = ``;
    if (query) {
      uri = `${url.baseWithSearch}?skip=${skip}&limit=${limit}&q=${query}`;
    } else {
      uri = `${url.base}?skip=${skip}&limit=${limit}`;
    }

    const { data, error, isLoading, mutate } = useSWR<IDokumentasi>(uri, http.fetcher);
    return {
      items: data?.products ?? [],
      total: data?.total ?? 0,
      skip: data?.skip ?? 0,
      isLoading,
      error,
      mutate,
    };
  },
  useDetailProduct: (id?: string) => {
    const keyUrl = !id ? null : `${url.base}/${id}`;
    const { data, error, isLoading, mutate } = useSWR<IDokumentasiDetail>(keyUrl, http.fetcher);
    return {
      data,
      isLoading,
      error,
      mutate,
    };
  },
};

const api = {
  create: (body: CreateDokumentasiDto) => http.post(url.base, body, null),
  update: (id: number, body: UpdateDokumentasiDto) => http.put(`${url.base}/${id}`, body, null),
  delete: (id: number) => http.del(`${url.base}/${id}`, null),
};

export const DokumentasiRepository = {
  url,
  hooks,
  api,
};
