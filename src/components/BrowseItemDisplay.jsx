import ItemCard from "./ItemCard";
import { Wrap, WrapItem } from "@chakra-ui/react";

export default function BrowseItemDisplay({ items }) {
  if (!items) {
    return <div>no items match your search</div>;
  }

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
