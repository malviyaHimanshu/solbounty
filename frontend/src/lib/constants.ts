type layout = {
  header_height: string;
  sidebar_width: string;
}

type screen_sizes = {
  mobile: layout;
  tablet: layout;
  desktop: layout;
}

export const screenSizes: screen_sizes = {
  mobile: {
    header_height: '70px',
    sidebar_width: '350px',
  },
  tablet: {
    header_height: '70px',
    sidebar_width: '350px',
  },
  desktop: {
    header_height: '70px',
    sidebar_width: '350px',
  },
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;