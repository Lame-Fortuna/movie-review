import React from 'react'
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar bg-gray-900 shadow px-4">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" href="/">Home</Link>
        </div>
        <form
          className="flex-none"
          onSubmit={(e) => {
            e.preventDefault();
            const val = (e.target as any).search.value.trim();
            if (val.length >= 2) {
              window.location.href = `/search/${encodeURIComponent(val)}/1`;
            }
          }}
        >
          <input name="search" type="text" placeholder="Search" className="input input-bordered" />
        </form>
        <div className="ml-4">
          <button className="btn btn-outline">Admin</button>
        </div>
    </nav>
  )
}