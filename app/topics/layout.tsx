
export default function TopicsLayout({children,intercepting}: {children: React.ReactNode, intercepting: React.ReactNode}) {
  return (
    <>
      {children}
      {intercepting}
    </>
  )
}