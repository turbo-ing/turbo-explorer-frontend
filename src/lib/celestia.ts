import { EasyCelestia } from "easy-celestia";

const celestia = new EasyCelestia({
  //don't need credentials to use namespace() function.
  network: "mocha",
  nodeEndpoint: "",
  nodeApiKey: "",
  celeniumApiKey: "",
});

export function formatNamespaceURL(rawNamespace: string): string {
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

// function formatNamespaceURL(namespace : string): string {
//   let shrunkNamespace;
//   if(namespace.length > 56){
//     shrunkNamespace = namespace.substring(namespace.length-56, namespace.length);
//   } else shrunkNamespace = namespace;
//   return `https://mocha-4.celenium.io/namespace/`+shrunkNamespace+"?tab=Blobs";
// }

// const formatCeleniumUrl = (domainName: string, gameId: string) => formatNamespaceURL("turbo.game#"+domainName+"#"+gameId)

// const formatCeleniumUrl = (json: string) => (formatNamespaceURL(JSON.parse(json)))

//namespace/00000000000000000000000000000000000094ef1cea2ef7726694b8?tab=Blobs

// 2048 space
///namespace/0000000000000000000000000000000000003bcd9a31095987be5063?tab=Blobs