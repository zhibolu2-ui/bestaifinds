import ContentMachineLayout from "@/components/ContentMachineLayout";

export const metadata = {
  title: "Content Machine – AI Content Generator",
  description: "Let AI create SEO-optimized content at scale. Generate articles, blog posts, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ContentMachineLayout>{children}</ContentMachineLayout>;
}
