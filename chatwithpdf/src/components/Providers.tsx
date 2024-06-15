'use client'
import React from 'react'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { Chilanka } from 'next/font/google'

type Props = {
    children: React.ReactNode
}

const queryClient = new QueryClient()

/**
 * Providers component, cache so dont have to re-render
 * 
 * This component wraps the children with QueryClientProvider from React Query.
 * It provides the QueryClient instance to all the components that need it.
 * 
 * @param {Props} props - The component props.
 * @param {React.ReactNode} props.children - The children to be wrapped.
 * @returns {JSX.Element} The wrapped children.
 */
const Providers = ({ children }: Props): JSX.Element => {
    // Wrap the children with QueryClientProvider from React Query.
    return (
        <QueryClientProvider client={queryClient}>
            {children} 
        </QueryClientProvider>
    );
}

export default Providers