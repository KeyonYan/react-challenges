'use client'
import { User } from "@/interfaces/user"
import { useEffect, useState } from "react"

export default function RouterHandlerPage() {
  const [users, setUsers] = useState<User[]>([]) // [1
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(({data}) => setUsers(data))
  }, [users])
  return (
    <>
      <div className="text-2xl font-bold">Nextjs Router handler & fetch</div>
      { users.map((user) => (
        <div key={user.id} className="flex flex-col gap-2">{user.id}. {user.name}</div>
      ))}
    </>
  )
}