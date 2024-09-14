import ItemCard from "./ItemCard";
import { Wrap, WrapItem } from "@chakra-ui/react";

export default function BrowseItemDisplay() {
  // this is a test item!
  const item = {
    title: "asdlkfjlkajsdflkaasdfasdflasdflk",
    imageUrl:
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    category: "category",
  };

  const items = [item, item, item];

  return (
    <Wrap spacing={4}>
      {items.map((item) => {
        return (
          <WrapItem>
            <ItemCard item={item} />
          </WrapItem>
        );
      })}
    </Wrap>
  );
}
