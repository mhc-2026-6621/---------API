import { Seller } from "@/types";

export const initialSellers: Seller[] = [
  {
    id: "seller_001",
    name: "関東建機販売株式会社",
    certified: true,
    riskGrade: "A",
    address: "千葉県市原市五井中央東2-1-1",
    contactName: "田中 一郎",
    payoutBankName: "〇〇銀行 千葉支店",
    payoutStatus: "active",
  },
  {
    id: "seller_002",
    name: "西日本物流機器株式会社",
    certified: true,
    riskGrade: "B",
    address: "神奈川県横浜市中区本町1-1-1",
    contactName: "佐藤 二郎",
    payoutBankName: "△△銀行 横浜支店",
    payoutStatus: "active",
  },
  {
    id: "seller_003",
    name: "中部精密機械商会",
    certified: true,
    riskGrade: "A",
    address: "愛知県豊田市トヨタ町1番地",
    contactName: "鈴木 三郎",
    payoutBankName: "□□銀行 豊田支店",
    payoutStatus: "active",
  },
  {
    id: "seller_004",
    name: "東京フードマシナリー株式会社",
    certified: false,
    riskGrade: "C",
    address: "東京都大田区蒲田5-1-1",
    contactName: "高橋 四郎",
    payoutBankName: "◇◇銀行 蒲田支店",
    payoutStatus: "pending",
  },
];
