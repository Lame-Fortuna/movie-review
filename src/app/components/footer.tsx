"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
    return (
      <footer className="footer sm:footer-horizontal bg-black text-base-content p-10">
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href="/about" className="link link-hover">About Us</Link>
          <Link href="/contact" className="link link-hover">Contact Us</Link>
        </nav>

        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link href="/dmca" className="link link-hover">DMCA Notice</Link>
          <Link href="/disclaimer" className="link link-hover">Disclaimer</Link>
          <Link href="/privacy-policy" className="link link-hover">Privacy Policy</Link>
          <Link href="/terms" className="link link-hover">Terms of Service</Link>
        </nav>

        <nav>
          <h6 className="footer-title">Social</h6>

          <div className="grid grid-flow-col gap-4">
            {/* X (Twitter) */}
            <Link href="#" aria-label="X">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2H21l-6.518 7.447L22 22h-6.828l-5.356-6.74L4.78 22H2l6.974-7.968L2 2h7l4.844 6.094L18.244 2z" />
              </svg>
            </Link>

            {/* Instagram */}
            <Link href="#" aria-label="Instagram">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5z" />
                <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.5A3.5 3.5 0 1 1 12 15a3.5 3.5 0 0 1 0-7z" />
                <circle cx="17.25" cy="6.75" r="1" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link href="#" aria-label="Facebook">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M9 8h-3v4h3v12h5V12h3.642l.358-4H14V6.333c0-.955.192-1.333 1.115-1.333H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
            </Link>
          </div>

          <aside className="grid-flow-col items-center mt-4">
            <p>
              Copyright © {new Date().getFullYear()} — All rights reserved
            </p>
          </aside>
        </nav>

        {/* Newsletter subscription - currently not implemented}
        <form>
          <h6 className="footer-title">Newsletter</h6>
          <fieldset className="w-80">
            <label>Enter your email address</label>
            <div className="join">
              <input
                type="text"
                placeholder="username@site.com"
                className="input input-bordered join-item" />
              <button className="btn btn-primary join-item">Subscribe</button>
            </div>
          </fieldset>
        </form>
        {*/}
      </footer>
    )
}