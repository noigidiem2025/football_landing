import type { NewsArticle } from "@/lib/types";

/**
 * News fallback for the Google Sheet `news` tab.
 *
 * NỘI DUNG MANG TÍNH THÔNG TIN/SỰ THẬT về World Cup 2026 (thể thức, chủ nhà, sân,
 * lịch khai mạc/chung kết — đều đã được công bố). KHÔNG phải tường thuật trận đấu
 * bịa hay bình luận chuyên gia giả. Khi nối Google Sheet, dữ liệu `news` từ sheet
 * sẽ thay thế các mục dưới đây.
 */
export const news: NewsArticle[] = [
  {
    slug: "world-cup-2026-lan-dau-48-doi",
    title: "World Cup 2026: Lần đầu tiên có 48 đội",
    excerpt:
      "Vòng chung kết mở rộng từ 32 lên 48 đội, chia thành 12 bảng và tăng lên 104 trận đấu.",
    category: "Thể thức",
    author: "Ban biên tập",
    publishedAt: "2026-06-16",
    tags: ["world-cup-2026", "the-thuc"],
    featured: true,
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80&auto=format&fit=crop",
    coverAlt: "Sân vận động bóng đá rực sáng dưới ánh đèn",
    body: `## Giải đấu lớn nhất lịch sử

World Cup 2026 là kỳ World Cup đầu tiên có 48 đội tham dự, tăng so với 32 đội ở các kỳ trước. Số đội nhiều hơn đồng nghĩa nhiều liên đoàn châu lục có thêm suất tham dự.

## 12 bảng, 104 trận

48 đội được chia thành 12 bảng, mỗi bảng 4 đội. Tổng số trận đấu tăng từ 64 lên 104, biến đây thành kỳ World Cup dài và quy mô nhất từ trước đến nay.

## Vòng đấu loại trực tiếp mở rộng

Hai đội đứng đầu mỗi bảng cùng 8 đội xếp thứ ba có thành tích tốt nhất sẽ giành vé vào vòng knock-out, bắt đầu từ vòng 1/16 (Round of 32).`,
  },
  {
    slug: "ba-quoc-gia-dong-dang-cai",
    title: "Mỹ, Canada và Mexico đồng đăng cai World Cup 2026",
    excerpt:
      "Lần đầu tiên một kỳ World Cup được ba quốc gia cùng tổ chức, trải rộng khắp Bắc Mỹ.",
    category: "Tổng quan",
    author: "Ban biên tập",
    publishedAt: "2026-06-15",
    tags: ["world-cup-2026", "chu-nha"],
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1200&q=80&auto=format&fit=crop",
    coverAlt: "Khán đài sân vận động đông kín cổ động viên",
    body: `## Ba nước chủ nhà

World Cup 2026 do Hoa Kỳ, Canada và Mexico đồng đăng cai — lần đầu tiên trong lịch sử giải đấu có ba quốc gia cùng tổ chức.

## Tự động giành vé

Là chủ nhà, cả ba đội tuyển Hoa Kỳ, Canada và Mexico đều được đặc cách tham dự vòng chung kết.

## Quy mô khắp lục địa

Các trận đấu diễn ra tại 16 thành phố trải dài khắp ba quốc gia, đưa World Cup đến gần hàng triệu người hâm mộ trên khắp Bắc Mỹ.`,
  },
  {
    slug: "khai-mac-va-chung-ket",
    title: "Khai mạc tại Estadio Azteca, chung kết ở MetLife Stadium",
    excerpt:
      "Trận khai mạc diễn ra ở Mexico City, trong khi trận chung kết được tổ chức tại khu vực New York.",
    category: "Lịch thi đấu",
    author: "Ban biên tập",
    publishedAt: "2026-06-14",
    tags: ["world-cup-2026", "lich-thi-dau"],
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80&auto=format&fit=crop",
    coverAlt: "Sân cỏ bóng đá nhìn từ trên cao",
    body: `## Khởi tranh ở Mexico

Trận khai mạc World Cup 2026 dự kiến diễn ra tại Estadio Azteca ở Mexico City — sân vận động giàu lịch sử từng đăng cai các kỳ World Cup trước.

## Chung kết tại MetLife Stadium

Trận chung kết được tổ chức tại MetLife Stadium ở khu vực New York / New Jersey, khép lại hành trình kéo dài hơn một tháng.

## Tranh hạng ba

Trận tranh hạng ba diễn ra trước đó tại Miami, một ngày trước trận chung kết.`,
  },
  {
    slug: "16-san-van-dong-dang-cai",
    title: "16 sân vận động đăng cai trên khắp Bắc Mỹ",
    excerpt:
      "11 sân tại Hoa Kỳ, 2 sân ở Canada và 3 sân tại Mexico được chọn tổ chức các trận đấu.",
    category: "Địa điểm",
    author: "Ban biên tập",
    publishedAt: "2026-06-13",
    tags: ["world-cup-2026", "san-van-dong"],
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=1200&q=80&auto=format&fit=crop",
    coverAlt: "Toàn cảnh sân vận động hiện đại",
    body: `## Hoa Kỳ

11 sân tại Hoa Kỳ gồm MetLife Stadium, SoFi Stadium, AT&T Stadium, Mercedes-Benz Stadium, Hard Rock Stadium, NRG Stadium, Arrowhead Stadium, Lincoln Financial Field, Levi's Stadium, Lumen Field và Gillette Stadium.

## Canada

Canada góp hai sân: BMO Field tại Toronto và BC Place tại Vancouver.

## Mexico

Mexico đóng góp ba sân: Estadio Azteca (Mexico City), Estadio BBVA (Monterrey) và Estadio Akron (Guadalajara).`,
  },
  {
    slug: "vong-knock-out-mo-rong",
    title: "Vòng knock-out mở rộng với vòng 1/16",
    excerpt:
      "Lần đầu tiên World Cup có vòng 1/16 (Round of 32) trước khi bước vào các vòng quen thuộc.",
    category: "Thể thức",
    author: "Ban biên tập",
    publishedAt: "2026-06-12",
    tags: ["world-cup-2026", "knock-out"],
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=1200&q=80&auto=format&fit=crop",
    coverAlt: "Trái bóng trên sân cỏ",
    body: `## Vòng 1/16 lần đầu xuất hiện

Với 48 đội, World Cup 2026 bổ sung vòng 1/16 (Round of 32) — vòng đấu loại trực tiếp đầu tiên trước khi vào vòng 1/8 quen thuộc.

## 32 đội vào knock-out

Hai đội đứng đầu mỗi bảng (24 đội) cùng 8 đội xếp thứ ba có thành tích tốt nhất tạo thành 32 đội bước vào giai đoạn đấu loại trực tiếp.

## Lộ trình tới chung kết

Sau vòng 1/16 là vòng 1/8, tứ kết, bán kết, tranh hạng ba và cuối cùng là trận chung kết.`,
  },
];
