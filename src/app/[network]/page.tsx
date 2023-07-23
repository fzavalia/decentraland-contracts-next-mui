import { notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { Button, Container, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import classNames from "classnames";
import { explorerLinks, fetchContracts } from "@/utils/fetchContracts";
import logo from "./img/logo.png";
import styles from "./page.module.css";

export type NetworkPageProps = {
  params: {
    network: string;
  };
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
          <Image src={logo} alt="logo" width={100} height={100} priority />
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }} align="right">
                    <Link href={`${explorerLinks[currentNetwork]}/address/${row.address}`}>{row.address}</Link>
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
