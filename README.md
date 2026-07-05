# SMTPDoctor

**Free email deliverability & DNS diagnostic tools — no signup, no limits.**

[**smtpdoctor.com →**](https://smtpdoctor.com)

A free toolkit for diagnosing the things that quietly break email deliverability and domain security. 28 tools that run live against real DNS and mail infrastructure — the checks MXToolbox charges for, without the paywall.

## Tools

**Email authentication**
- SPF Checker — validates syntax and counts DNS lookups against the 10-lookup limit that silently breaks SPF
- - DKIM Checker — scans common selectors or checks a specific one
  - - DMARC Checker — parses policy, alignment, pct, and reporting addresses
    - - BIMI, MTA-STS, TLS-RPT checkers
     
      - **DNS records**
      - - MX, NS, A/AAAA, CNAME, TXT, PTR lookups
        - - DNS propagation across Google, Cloudflare, Quad9, and OpenDNS
          - - DNSSEC and CAA checkers
           
            - **Security**
            - - Blacklist checker (11 major RBLs)
              - - Open relay test, AXFR zone-transfer test
                - - SSL/TLS certificate inspection, security headers, HSTS
                 
                  - **Diagnostics**
                  - - WHOIS, domain age, subdomain scanner
                    - - SMTP banner and STARTTLS checks
                      - - Composite domain reputation scoring
                       
                        - ## Tech
                        - 
                        Next.js 16 (App Router), TypeScript, Tailwind CSS, deployed on Vercel. All checks are real server-side DNS/socket queries — not cached lookups.

## About

Built by RehaVerse Studio. Free to use, no account required. Feedback and tool suggestions welcome via issues.
