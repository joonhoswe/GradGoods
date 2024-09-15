import ItemCard from "./ItemCard";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function BrowseItemDisplay({ items }) {
  const navigate = useNavigate();
  console.log(items);
  if (!items || items.length === 0) {
    return <div>No items match your search!</div>;
  }

  const handleCardClick = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <Wrap spacing={4}>
      {items.map((item) => {
        console.log(item.id);
        return (
          <WrapItem key={item.id}>
            <div onClick={() => handleCardClick(item.id)}>
              <ItemCard item={item} />
            </div>
          </WrapItem>
        );
      })}
    </Wrap>
  );
}
