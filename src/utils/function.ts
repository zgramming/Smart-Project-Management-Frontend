import { ModulV2 } from '@/interface/category_modul';
import { dummmyModulAndMenuV2 } from './dummy_data';
import axios, { AxiosError } from 'axios';

type IsSideMenuActiveProps = {
  currentPath: string;
  link: string;
};

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const convertRoutePathToArray = (pathname: string): string[] => {
  return pathname
    .split('/')
    .filter((route) => route.length !== 0)
    .map((route) => {
      const split = route.split('_');

      /// Route => user_group become User Group
      if (split.length > 1) {
        const capitalizeName = split.map((val) => (val[0]?.toUpperCase() ?? 'default') + val.slice(1));

        return capitalizeName.join(' ');
      }

      return route;
    });
};

const convertObjectIntoQueryParams = (queryParam: any) => {
  if (!queryParam) return '';

  const params =
    '?' +
    Object.keys(queryParam)
      .map((key) => key + '=' + queryParam[key])
      .join('&');

  return params;
};

const isSideMenuActive = ({ currentPath, link }: IsSideMenuActiveProps) => {
  if (link === '/' || link === '' || link.length === 0) return false;

  const arrCurrentPath = currentPath.split('/').filter((item) => item !== '');
  const arrLink = link.split('/').filter((item) => item !== '');

  const lenArrLink = arrLink.length;

  let isEqual = false;
  let counterPathEqual = 0;

  for (let i = 0; i < lenArrLink; i++) {
    const isSamePath = arrLink[i] === arrCurrentPath[i];
    if (isSamePath) counterPathEqual += 1;
  }

  if (counterPathEqual === lenArrLink) isEqual = true;

  return isEqual;
};

export const getInformationModulAndMenu = (path: string) => {
  try {
    const joinedSlicePrefix = (prefix: string) => {
      const splitPrefix = prefix.split('/').filter((item) => item !== '');
      const joinedPath = splitPath.slice(0, splitPrefix.length).join('/');
      return joinedPath;
    };

    const splitPath = path.split('/').filter((item) => item !== '');

    const filteredModul: ModulV2[] = [];

    // current menu : agen/brink_link/approval
    // prefix : agen/brink_link

    for (const categoryModul of dummmyModulAndMenuV2) {
      for (const modulItem of categoryModul.moduls) {
        if (modulItem.prefix.includes(joinedSlicePrefix(modulItem.prefix)) || modulItem.prefix === splitPath[0]) {
          filteredModul.push(modulItem);
        }
      }
    }

    if (filteredModul.length === 0) {
      throw new Error('Modul prefix not valid');
    }

    const modul = filteredModul.find((item) => {
      if (filteredModul.length === 1) {
        return true;
      }

      return item.prefix.includes(joinedSlicePrefix(item.prefix));
    });

    if (!modul) {
      throw new Error('Modul not found');
    }

    return {
      nameModul: modul.name,
      menus: modul.menus ?? [],
    };
  } catch (error) {
    return {
      nameModul: '',
      menus: [],
    };
  }
};

const numberInputParser = (value: string) => {
  return value.replace(/\$\s?|(,*)/g, '');
};

const numberInputFormatter = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getErrorMessageAxios = (error: any) => {
  // Check if axios error
  let message = 'Terjadi kesalahan pada server';
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const {
        data,
      }: {
        data: any;
      } = axiosError.response;
      message = data.message;
    }
  }

  return message;
};

const generateStringPagination = (currentPage: number, PageSize: number, totalData: number) => {
  const startData = PageSize * 0 + 1;
  let endData = Number(PageSize) * currentPage;

  if (totalData < endData) {
    endData = totalData;
  }

  return 'Menampilkan ' + startData + '-' + endData + ' dari ' + totalData + ' data';
};

export {
  sleep,
  convertRoutePathToArray,
  convertObjectIntoQueryParams,
  isSideMenuActive,
  numberInputParser,
  numberInputFormatter,
  getErrorMessageAxios,
  generateStringPagination,
};
