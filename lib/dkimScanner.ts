import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const selectors = [
  "default",
  "selector1",
  "selector2",
  "google",
  "googlemail",
  "k1",
  "k2",
  "s1",
  "s2",
  "dkim",
  "mail",
  "smtp",
  "mandrill",
  "mailchimp",
  "zoho",
  "zendesk",
  "amazonses",
  "sendgrid",
  "sparkpost",
  "mimecast",
  "m1",
  "m2",
  "scph",
  "api",
  "email",
  "smtp1",
  "smtp2",
  "mx",
];

export async function scanDKIM(domain: string) {
  const checks = selectors.map(async (selector) => {
    const host = `${selector}._domainkey.${domain}`;

    try {
      const txt = await resolver.resolveTxt(host);
      const record = txt.flat().join("");

      if (record.includes("v=DKIM1")) {
        return {
          selector,
          host,
          record: record.slice(0, 200) + "...",
          found: true,
        };
      }
    } catch {}

    return null;
  });

  const results = await Promise.all(checks);

  return results.filter(Boolean);
}