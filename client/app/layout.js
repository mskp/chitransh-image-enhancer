import './globals.css'
import { Poppins } from 'next/font/google'
import Header from "@/components/Header/Header"

const poppins = Poppins({ subsets: ['latin'], weight: '200' })

export const metadata = {
  title: 'Chitransh: AI Image Enhancer',
  manifest: "/manifest.json"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-900 text-white`}>
        <Header/> 
        {children}
      </body>
    </html>
  )
}
