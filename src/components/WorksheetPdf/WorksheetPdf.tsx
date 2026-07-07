import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Chess } from "chess.js";
import { Question } from "../../types";
import { toPersianNumber } from "../../utils/persianNumbers";

// ثبت فونت
Font.register({
  family: "Vazirmatn",
  fonts: [
    { src: "/fonts/Vazirmatn-Regular.ttf" },
    { src: "/fonts/Vazirmatn-Bold.ttf", fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// تغییر مسیر تصاویر به فایل‌های دانلود شده در سیستم خودت (پوشه public/pieces)
const PIECE_IMG = (pieceType: string, color: string) =>
  `/pieces/${color}${pieceType}.png`;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Vazirmatn",
    fontSize: 11,
    padding: 32,
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  header: {
    borderBottom: "1pt solid #cbd5e1",
    paddingBottom: 8,
    marginBottom: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 14, fontWeight: 700 },
  headerAuthor: { fontSize: 10, color: "#475569" },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    textAlign: "center",
    fontSize: 9,
    color: "#64748b",
  },
  questionGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 16, // افزایش فاصله بین کارت‌ها
    marginHorizontal: -8,
  },
  questionCardFull: {
    width: "100%",
    padding: 16, // افزایش پدینگ داخلی برای ایجاد گپ تمیز دور صفحه
    border: "1pt solid #e2e8f0",
    borderRadius: 8,
    marginBottom: 16,
  },
  questionCardHalf: {
    width: "48%",
    padding: 12,
    border: "1pt solid #e2e8f0",
    borderRadius: 8,
    marginBottom: 16,
  },
  qHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  qBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 3,
  },
  qPrompt: { fontSize: 12, fontWeight: 700, flex: 1, textAlign: "right" },
  qDescription: { fontSize: 11, color: "#334155", marginTop: 8, textAlign: "right", lineHeight: 1.5 },
  turnLabel: { fontSize: 11, color: "#475569", marginTop: 12, textAlign: "right", fontWeight: 700 },
  board: {
    marginTop: 8,
    alignSelf: "center",
    borderWidth: 1.5, // ضخیم‌تر شدن حاشیه دور صفحه برای ظاهر حرفه‌ای‌تر
    borderColor: "#334155",
  },
  row: { flexDirection: "row" },
  squareLight: {
    backgroundColor: "#f0d9b5",
    position: "relative",
  },
  squareDark: {
    backgroundColor: "#b58863",
    position: "relative",
  },
});

export interface WorksheetSettings {
  title: string;
  layout: number;
  showPageNumbers?: boolean;
}

interface WorksheetPdfProps {
  settings: WorksheetSettings;
  questions: Question[];
}

export function WorksheetPdf({ settings, questions }: WorksheetPdfProps) {
  const perPage = settings.layout;
  const pages: Question[][] = [];
  for (let i = 0; i < questions.length; i += perPage) {
    pages.push(questions.slice(i, i + perPage));
  }

  // اصلاح سایز برد: 440 برای تک‌سوال (کاملاً فیت با یک گپ زیبا) و 215 برای دو/چهار سوال
  const boardSize = perPage === 1 ? 440 : 215;

  return (
    <Document title={settings.title} author="کاربرگ‌ساز شطرنج">
      {pages.map((group, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{settings.title || 'بدون عنوان'}</Text>
            <Text style={styles.headerAuthor}>کاربرگ‌ساز شطرنج</Text>
          </View>

          <View style={styles.questionGrid}>
            {group.map((q, i) => {
              const globalIndex = pageIndex * perPage + i;
              return (
                <View
                  key={q.id}
                  style={perPage === 1 ? styles.questionCardFull : styles.questionCardHalf}
                  wrap={false}
                >
                  <View style={styles.qHeader}>
                    <Text style={styles.qBadge}>{toPersianNumber(globalIndex + 1)}</Text>
                    <Text style={styles.qPrompt}>{q.title || "بدون صورت سوال"}</Text>
                  </View>

                  <BoardDiagram
                    fen={q.fen}
                    orientation={q.orientation}
                    size={boardSize}
                  />

                  <Text style={styles.turnLabel}>
                    نوبت حرکت: {sideLabel(q.fen)}
                  </Text>

                  {q.description ? (
                    <Text style={styles.qDescription}>{q.description}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          {settings.showPageNumbers !== false ? (
            <Text
              style={styles.footer}
              render={({ pageNumber, totalPages }) =>
                `صفحه ${toPersianNumber(pageNumber)} از ${toPersianNumber(totalPages)}`
              }
              fixed
            />
          ) : null}
        </Page>
      ))}
    </Document>
  );
}

function sideLabel(fen: string): string {
  return fen.split(" ")[1] === "b" ? "سیاه" : "سفید";
}

interface BoardDiagramProps {
  fen: string;
  orientation: "white" | "black";
  size: number;
}

function BoardDiagram({ fen, orientation, size }: BoardDiagramProps) {
  const board = fenToBoard(fen);
  // حذف Math.floor برای جلوگیری از فاصله‌های ۱ پیکسلیِ سفید بین خانه‌ها در PDF
  const squareSize = size / 8; 
  const rows = orientation === "white" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = orientation === "white" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <View style={[styles.board, { width: squareSize * 8, height: squareSize * 8 }]}>
      {rows.map((r) => (
        <View key={r} style={styles.row}>
          {cols.map((c) => {
            const light = (r + c) % 2 === 0;
            const piece = board[r][c];
            return (
              <View
                key={c}
                style={[
                  light ? styles.squareLight : styles.squareDark,
                  { width: squareSize, height: squareSize },
                ]}
              >
                {piece ? (
                  <Image
                    src={PIECE_IMG(piece.type.toLowerCase(), piece.color)}
                    style={{ width: squareSize, height: squareSize }}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function fenToBoard(fen: string): Array<Array<{ type: string; color: "w" | "b" } | null>> {
  try {
    const chess = new Chess();
    (chess as unknown as { load: (f: string, o?: { skipValidation?: boolean }) => void })
      .load(fen, { skipValidation: true });
    return chess.board().map((row) =>
      row.map((sq) => (sq ? { type: sq.type, color: sq.color } : null)),
    );
  } catch {
    return Array.from({ length: 8 }, () => Array(8).fill(null));
  }
}