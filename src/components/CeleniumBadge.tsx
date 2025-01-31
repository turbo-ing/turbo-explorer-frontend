import Link from "next/link";
import { EasyCelestia } from "easy-celestia";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const celestia = new EasyCelestia({
  //don't need credentials to use namespace() function.
  network: "mocha",
  nodeEndpoint: "",
  nodeApiKey: "",
  celeniumApiKey: "",
});

function formatNamespaceURL(rawNamespace: string): string {
  const namespace = celestia.namespace(rawNamespace).toString("hex");
  let shrunkNamespace;
  if (namespace.length > 56) {
    shrunkNamespace = namespace.substring(
      namespace.length - 56,
      namespace.length
    );
  } else shrunkNamespace = namespace;
  return (
    `https://mocha-4.celenium.io/namespace/` + shrunkNamespace + "?tab=Blobs"
  );
}
// const formatCeleniumUrl = (domainName: string, gameId: string) => formatNamespaceURL("turbo.game#"+domainName+"#"+gameId)

// const formatCeleniumUrl = (json: string) => (formatNamespaceURL(JSON.parse(json)))

// 2048 space
///namespace/0000000000000000000000000000000000003bcd9a31095987be5063?tab=Blobs

//"turbo.game#" + game.domain_name + "#" + game.game_id
export default function CeleniumBadge({namespaceString, className}: {namespaceString: string, className?: string}) {
    return (
        <div className={cn('w-[8.5rem]', className)}>
            <Link href={formatNamespaceURL(namespaceString)}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className='flex text-xs bg-stone-900 text-white px-2 rounded-full py-1 hover:bg-white hover:text-stone-900 border border-transparent hover:border-stone-900'>View on celenium <ExternalLink className='size-3.5 ml-1' />
                </span>
            </Link>
        </div>
    )
}