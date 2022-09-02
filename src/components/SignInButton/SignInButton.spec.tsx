import { render, screen } from '@testing-library/react';


import {useSession} from 'next-auth/react';
import { SignInButton } from '.';

jest.mock("next-auth/react")

describe('SignInButton component', ()=> {
  it('renders correctly when user is not authentication', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading"} as any)
    render(
      <SignInButton />
    )
    
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();

  })

  it('renders correctly when user is authentication', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        expires: "fake-expires"
      },
      status: "authenticated",
    } as any)
   
    render(
      <SignInButton />
    )

 
    expect(screen.getByText("John Doe")).toBeInTheDocument();
   
  })
})

