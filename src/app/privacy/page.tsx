import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BestAIFinds privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 prose prose-gray dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: May 2026</p>

      <p>BestAIFinds (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the website bestaifinds.com. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

      <h2>1. Information We Collect</h2>
      <h3>Files You Upload</h3>
      <p>When you use our tools, files are processed either in your browser (client-side) or on our servers. <strong>Browser-processed files never leave your device.</strong> Server-processed files are automatically deleted within 1 hour after processing.</p>

      <h3>Usage Data</h3>
      <p>We collect anonymous usage data through Google Analytics, including pages visited, tools used, and device information. This data does not personally identify you.</p>

      <h3>Cookies</h3>
      <p>We use essential cookies for site functionality and analytics cookies (Google Analytics) to improve our services. You can disable cookies in your browser settings.</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our online tools</li>
        <li>To analyze usage patterns and optimize performance</li>
        <li>To display relevant advertisements (Google AdSense)</li>
        <li>To process payments for Pro subscriptions</li>
      </ul>

      <h2>3. Data Security</h2>
      <p>We implement industry-standard security measures including HTTPS encryption, secure server infrastructure, and automatic file deletion. We do not sell your personal data to third parties.</p>

      <h2>4. Third-Party Services</h2>
      <ul>
        <li><strong>Google Analytics</strong>: For website analytics</li>
        <li><strong>Google AdSense</strong>: For displaying advertisements</li>
        <li><strong>OpenAI</strong>: For AI-powered tools (text submitted to AI tools is processed by OpenAI&apos;s API)</li>
      </ul>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request deletion of your data</li>
        <li>Opt out of analytics tracking</li>
        <li>Withdraw consent at any time</li>
      </ul>

      <h2>6. Contact</h2>
      <p>For privacy-related inquiries, contact us at: <a href="mailto:privacy@bestaifinds.com">privacy@bestaifinds.com</a></p>
    </article>
  );
}
