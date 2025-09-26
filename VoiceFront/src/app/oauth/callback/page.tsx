import OAuthCallback from "./OAuthCallback";

export default function CallbackPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return <OAuthCallback searchParams={searchParams} />;
}
