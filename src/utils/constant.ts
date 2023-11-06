export const baseApiURL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const baseFileURL = `${baseApiURL}/uploads`;
export const TOKEN_KEY = 'token';

export const availableAccessAction = ['view', 'create', 'update', 'delete', 'print', 'export', 'import', 'approve'];

// This breakpoint follow tailwindcss breakpoint https://tailwindcss.com/docs/breakpoints
export const breakpoint = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
