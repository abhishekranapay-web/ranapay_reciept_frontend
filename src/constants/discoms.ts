export type DiscomKey = "PVVNL" | "DVVNL" | "PuVVNL" | "KESCO" | "MVVNL";

export interface DiscomMeta {
  key: DiscomKey;
  name: string;
  address: string;
  logo: string;
  tollFree: string;
}

export const DISCOMS: Record<DiscomKey, DiscomMeta> = {
  PVVNL: {
    key: "PVVNL",
    name: "PASCHIMANCHAL VIDYUT VITRAN NIGAM LTD.",
    address: "VICTORIA PARK, MEERUT, U.P - 250001",
    logo: "/logos/pvvnl.jpg",
    tollFree: "1800-270-0900",
  },
  DVVNL: {
    key: "DVVNL",
    name: "DAKSHINANCHAL VIDYUT VITRAN NIGAM LTD.",
    address: "URJA BHAVAN, SIKANDRA, AGRA, U.P - 282007",
    logo: "/logos/dvvnl.jpg",
    tollFree: "1800-270-0900",
  },
  PuVVNL: {
    key: "PuVVNL",
    name: "PURVANCHAL VIDYUT VITRAN NIGAM LTD.",
    address: "BHIKHARIPUR, DLW ROAD, VARANASI, U.P - 221004",
    logo: "/logos/puvvnl.jpg",
    tollFree: "1800-270-0900",
  },
  KESCO: {
    key: "KESCO",
    name: "KANPUR ELECTRICITY SUPPLY COMPANY LTD.",
    address: "KESA HOUSE, 14/71 CIVIL LINES, KANPUR, U.P - 208001",
    logo: "/logos/kesco.jpg",
    tollFree: "1800-270-0900",
  },
  MVVNL: {
    key: "MVVNL",
    name: "MADHYANCHAL VIDYUT VITRAN NIGAM LTD.",
    address: "4-A, GOKHALE MARG, LUCKNOW, U.P - 226001",
    logo: "/logos/mvvnl.jpg",
    tollFree: "1800-270-0900",
  },
};

export const DISCOM_KEYS = Object.keys(DISCOMS) as DiscomKey[];

export const CONNECTION_TYPES = ["POSTPAID", "PREPAID"] as const;
export const AREAS = ["RURAL", "URBAN", "IPDS", "RAPDRP"] as const;
export const PAYMENT_MODES = ["PG", "WALLET"] as const;

export const AGENCY_NAME = "RANAPAY INDIA PRIVATE LIMITED";
export const RANAPAY_LOGO = "/logos/ranapay.png";
