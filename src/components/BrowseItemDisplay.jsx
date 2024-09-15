import ItemCard from "./ItemCard";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function BrowseItemDisplay({ items, isEmailValid, school }) {
  const navigate = useNavigate();
  console.log(items);
  if (!items || items.length === 0) {
    return <div>No items match your search!</div>;
  }

  const handleCardClick = (id) => {
    if (isEmailValid) {
      navigate(`/listing/${id}`, { state: { school } });
    }
  };

  return (
    <Wrap spacing={4}>
      {items.map((item) => {
        console.log(item.id);
        return (
          <WrapItem key={item.id}>
            <div
              onClick={() => handleCardClick(item.id)}
              className={isEmailValid ? 'cursor-pointer' : 'cursor-not-allowed'}
            >
              <ItemCard item={item} />
            </div>
          </WrapItem>
        );
      })}
    </Wrap>
  );
}
