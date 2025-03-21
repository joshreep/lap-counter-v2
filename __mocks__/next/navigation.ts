export const useRouter = jest.fn().mockReturnValue({
  pathname: '/',
  push: jest.fn(),
  back: jest.fn(),
})

export const usePathname = jest.fn().mockReturnValue('/')
