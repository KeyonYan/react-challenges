'use client'

import AppLayout from "@/components/AppLayout";
import { atom, useAtom } from "jotai";

const comps = atom([
  {
    row: 0,
    col: 0,
    width: 1,
    height: 1,
  },{
    row: 0,
    col: 1,
    width: 1,
    height: 1,
  },{
    row: 1,
    col: 0,
    width: 2,
    height: 1,
  },
])

export default function AppLayoutPage() {
  const [compsValue, setCompsValue] = useAtom(comps)
  return (
    <AppLayout comps={compsValue} gap={20} unit={50} className="relative w-[800px] h-[800px] m-10 border">
    </AppLayout>
  )
}