export type NetworkContracts = Record<string, string>;

export type Contracts = Record<string, NetworkContracts>;

export async function fetchContracts(): Promise<Contracts> {
  const response = await fetch("https://contracts.decentraland.org/addresses.json");

  const contracts: Contracts = await response.json();

  const wl = new Set(["mainnet", "goerli", "sepolia", "matic", "mumbai"]);

  return Object.entries(contracts).reduce(
    (acc, [network, contracts]) => (wl.has(network) ? { ...acc, [network]: contracts } : acc),
    {} as Contracts
  );
}

export const explorerLinks: Record<string, string> = {
  mainnet: "https://etherscan.io",
  goerli: "https://goerli.etherscan.io",
  sepolia: "https://sepolia.etherscan.io",
  matic: "https://polygonscan.com",
  mumbai: "https://mumbai.polygonscan.com",
};
