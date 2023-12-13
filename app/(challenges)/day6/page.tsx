'use client'
import Card from "@/components/Card/Card";

const Day6 = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Card</div>
      <Card height={200} width={200} />
    </div>
  )
}

export default Day6;