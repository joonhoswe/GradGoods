import ItemCard from "./ItemCard";
import { Wrap, WrapItem } from "@chakra-ui/react";

export default function BrowseItemDisplay({ items }) {
  console.log(items);
  if (!items || items.length === 0) {
    return <div>No items match your search!</div>;
  }

  return (
    <Wrap spacing={4}>
      {items.map((item) => {
        return (
          <WrapItem key={item.id}>
            <ItemCard item={item} />
          </WrapItem>
        );
      })}
    </Wrap>
  );
}
