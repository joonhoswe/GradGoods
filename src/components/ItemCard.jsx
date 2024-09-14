import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  ChakraProvider
} from '@chakra-ui/react';

// item fields:
// title, imageUrl, category, 
const ItemCard = ({ item }) => {
  return (
    <ChakraProvider>
        <Card 
            maxW='sm' 
            borderRadius='lg' 
            boxShadow='lg'
            _hover={{
                boxShadow: 'xl',
                transform: 'scale(1.02)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease', 
              }}
              transition='all 0.4s ease' 
        >
            <CardBody>
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    borderRadius='lg'
                    objectFit='cover'
                    boxSize='100%'
                />
                <Stack mt='2' spacing='1'>
                    <Text color='#979797' fontSize='12px' textAlign='left'>{item.category}</Text>
                    <Heading size='md' textAlign='left'>{item.title}</Heading>
                    <Text color='black' fontSize='1xl' textAlign='left' fontWeight='500'>
                        ${item.price}
                    </Text>
                </Stack>
            </CardBody>
        </Card>
    </ChakraProvider>

  );
};

export default ItemCard;
