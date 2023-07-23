import { notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { Button, Container, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import classNames from "classnames";
import styles from "./page.module.css";

enum NetworkName {
  Mainnet = "mainnet",
  Goerli = "goerli",
  Sepolia = "sepolia",
  Matic = "matic",
  Mumbai = "mumbai",
}

type NetworkContracts = Record<string, string>;

type Contracts = Record<NetworkName, NetworkContracts>;

type NetworkPageProps = {
  params: {
    network: string;
  };
};

const networkNames = Object.values(NetworkName);

const networkExplorers: Record<NetworkName, string> = {
  [NetworkName.Mainnet]: "https://etherscan.io",
  [NetworkName.Goerli]: "https://goerli.etherscan.io",
  [NetworkName.Sepolia]: "https://sepolia.etherscan.io",
  [NetworkName.Matic]: "https://polygonscan.com",
  [NetworkName.Mumbai]: "https://mumbai.polygonscan.com",
};

export default async function NetworkPage({ params }: NetworkPageProps) {
  if (!(networkNames as string[]).includes(params.network)) {
    notFound();
  }

  const currNetworkName = params.network as NetworkName;
  const contracts = await fetchContracts();
  const networkContracts: Record<string, string> | undefined = contracts[currNetworkName];

  if (!networkContracts) {
    notFound();
  }

  const rows = Object.entries(networkContracts).map(([name, address]) => ({ name, address }));

  return (
    <Container>
      <header style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem" }}>
          <Image src="/logo.png" alt="logo" width={100} height={100} priority />
        </div>
        <nav style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
          {networkNames.map((networkName) => {
            return (
              <div key={networkName}>
                <Button component={NextLink} href={`/${networkName}`}>
                  {networkName}
                </Button>
                <div className={classNames(styles.dot, networkName === currNetworkName && styles.enabled)} />
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
                    <Link href={`${networkExplorers[currNetworkName]}/address/${row.address}`}>{row.address}</Link>
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
  return (await fetch("https://contracts.decentraland.org/addresses.json")).json();
}
