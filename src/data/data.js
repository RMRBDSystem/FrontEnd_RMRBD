import websiteIcon from "/images/icon/Web.svg";
import apiIcon from "/images/icon/API.svg";
import databaseIcon from "/images/icon/DATA.svg";
import customSolutionsIcon from "/images/icon/SOLUTION.svg";
import ecommerceIcon from "/images/icon/ECOMMERCE.svg";
import supportIcon from "/images/icon/SUPPORT.svg";

export const leftLinks = [
  { href: "/", title: "Home" },
  { href: "/recharge", title: "Recharge" },
];
export const rightLinks = [
  { href: "/#contact", title: "Contact" },
  { href: "/faq", title: "FAQ" },
];

export const filterableData = [
  {
    name: "recipe",
    src: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=375,341",
    title: "Easy recipes",
    text: "Keep it easy with these simple but delicious recipes. From make-ahead lunches and midweek meals to fuss-free sides and moreish cakes, we've got everything",
  },
  {
    name: "book",
    src: "https://ph-test-11.slatic.net/p/63849abfbb4eb6035fdfbc2b35764ecd.jpg",
    title: "Save Your Cooking Recipe",
    text: "By keeping a blank recipe book to write in, you can recreate a recipe in your own kitchen, capture those missing details, and make a truly special dish.",
  },
  {
    name: "ebook",
    src: "https://www.eastathome.com/cdn/shop/files/ebook-spread-2-min_2000x2000.jpg?v=1695596190",
    title: "Modeller",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "recipe",
    src: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/easy-chicken-curry-aa22a0b.jpg?quality=90&webp=true&resize=375,341",
    title: "Chicken curry",
    text: "This easy staple chicken curry is a fantastic recipe for family dinners. It's made with just a handful of ingredients and is enriched with creamy yogurt.",
  },
  {
    name: "book",
    src: "https://images.squarespace-cdn.com/content/v1/5f7396b28797c41c9fcb85f3/1698864630748-ZYL07A4ALTWE59BR7GGR/Spring_Planner_Book_Bag_Pack4.jpeg?format=1000w",
    title: "Healthy Food Guide",
    text: "Get a great Healthy Food Guide Cookbook, all packed full of tasty, healthy recipe ideas!",
  },
  {
    name: "ebook",
    src: "https://www.eastathome.com/cdn/shop/files/ebook-spread-5-min_2000x2000.jpg?v=1695596295",
    title: "Artist",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "recipe",
    src: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/yummy-scrummy-carrot-cake_1-964d640.jpg?quality=90&webp=true&resize=375,341",
    title: "Carrot cake",
    text: "Delight friends with an afternoon tea that includes this easy carrot cake. You can bake the cake, freeze it and just drizzle over the icing on the day",
  },
  {
    name: "book",
    src: "https://media.takealot.com/covers_images/01e7415ef94d444ba95368791de94318/s-pdpxl.file",
    title: "Family Favourite Recipes",
    text: "Practical Blank Cooking Recipe BookThis Blank Cooking Recipe Book contains many interesting features, here is how to use them Choose a different color for every bookmark next to the type of dish.",
  },
  {
    name: "ebook",
    src: "https://templatelab.com/wp-content/uploads/2023/06/Recipe-Book-Template-3-scaled.jpg",
    title: "Saxophonist",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
export const services = [
  {
    id: 1,
    service: "Phát triển Website",
    description:
      "Phát triển website quản lý công thức và phân phối sách sử dụng .NET, ReactJS và RESTful API, giúp tối ưu hóa hiệu suất và trải nghiệm người dùng.",
    icon: websiteIcon,
    border: "border-b md:border-r",
  },
  {
    id: 2,
    service: "Tích hợp API",
    description:
      "Tích hợp RESTful API để đồng bộ dữ liệu giữa các hệ thống và đảm bảo kết nối hiệu quả cho quản lý công thức và sách.",
    icon: apiIcon,
    border: "border-b lg:border-r",
  },
  {
    id: 3,
    service: "Quản lý Cơ sở Dữ liệu",
    description:
      "Sử dụng SQL Server để quản lý dữ liệu sách và công thức, đảm bảo truy xuất nhanh và an toàn.",
    icon: databaseIcon,
    border: "border-b md:border-r lg:border-r-0",
  },
  {
    id: 4,
    service: "Giải pháp Tùy Chỉnh",
    description:
      "Cung cấp giải pháp tùy chỉnh phù hợp với nhu cầu cụ thể, từ quản lý sách đến công thức nấu ăn.",
    icon: customSolutionsIcon,
    border: "border-b lg:border-r lg:border-b-0",
  },
  {
    id: 5,
    service: "Tích hợp Thương mại Điện tử",
    description:
      "Tích hợp chức năng bán sách trực tuyến, xử lý thanh toán và quản lý đơn hàng dễ dàng và bảo mật.",
    icon: ecommerceIcon,
    border: "border-b md:border-r md:border-b-0 lg:border-b-0",
  },
  {
    id: 6,
    service: "Duy trì & Hỗ trợ",
    description:
      "Cung cấp bảo trì và hỗ trợ liên tục, đảm bảo hệ thống hoạt động ổn định và bảo mật.",
    icon: supportIcon,
    border: "",
  },
];
