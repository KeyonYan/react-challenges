'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const paths = usePathname()
  const pathNames = paths.split('/').filter(path => path)
  return (
    <div className="m-4">
      <Breadcrumb className="ml-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          {
            pathNames.map((link, index) => {
              let href = `/${pathNames.slice(0, index + 1).join('/')}`
              let ItemActive = paths === href ? BreadcrumbPage : BreadcrumbLink

              return (
                <Fragment key={index}>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <ItemActive href={link}>
                      {link}
                    </ItemActive>
                  </BreadcrumbItem>
                </Fragment>
              )
            })
          }
        </BreadcrumbList>
      </Breadcrumb>
      <div className="m-4">
        {children}
      </div>
    </div>
  )
}