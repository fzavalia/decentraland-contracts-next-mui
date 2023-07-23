import { notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { Button, Container, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import classNames from "classnames";
import styles from "./page.module.css";

export type NetworkContracts = Record<string, string>;

export type Contracts = Record<string, NetworkContracts>;

export type NetworkPageProps = {
  params: {
    network: string;
  };
};

export const explorers: Record<string, string> = {
  mainnet: "https://etherscan.io",
  goerli: "https://goerli.etherscan.io",
  sepolia: "https://sepolia.etherscan.io",
  matic: "https://polygonscan.com",
  mumbai: "https://mumbai.polygonscan.com",
};

export default async function NetworkPage({ params }: NetworkPageProps) {
  const { network: currentNetwork } = params;

  const contracts = await fetchContracts();

  const networkContracts: Record<string, string> | undefined = contracts[currentNetwork];

  if (!networkContracts) {
    notFound();
  }

  const networks = Object.keys(contracts);

  const rows = Object.entries(networkContracts).map(([name, address]) => ({ name, address }));

  return (
    <Container>
      <header style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem" }}>
          <Image src="/logo.png" alt="logo" width={100} height={100} priority />
        </div>
        <nav style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
          {networks.map((network) => {
            return (
              <div key={network}>
                <Button component={NextLink} href={`/${network}`}>
                  {network}
                </Button>
                <div className={classNames(styles.dot, currentNetwork === network && styles.enabled)} />
              </div>
            );
          })}
        </nav>
      </header>
      <main>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody sx={{ fontSize: "2rem" }}>
              {rows.map((row) => (
                <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontFamily: "monospace" }} align="right">
                    <Link href={`${explorers[currentNetwork]}/address/${row.address}`}>{row.address}</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </Container>
  );
}

async function fetchContracts(): Promise<Contracts> {
  const response = await fetch("https://contracts.decentraland.org/addresses.json");

  const contracts: Contracts = await response.json();

  const wl = new Set(["mainnet", "goerli", "sepolia", "matic", "mumbai"]);

  return Object.entries(contracts).reduce(
    (acc, [network, contracts]) => (wl.has(network) ? { ...acc, [network]: contracts } : acc),
    {} as Contracts
  );
}
