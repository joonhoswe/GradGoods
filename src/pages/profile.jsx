import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";
import { Heading, Divider } from "@chakra-ui/react";

export default function Profile() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (isSignedIn) {
    const { imageUrl } = user;
    const params = new URLSearchParams();
    params.set("height", "200");
    params.set("width", "200");
    params.set("quality", "100");
    params.set("fit", "crop");
    const imageSrc = `${imageUrl}?${params.toString()}`;

    return (
      <div>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="mt-24 mx-[5vw]">
          <Heading
            className="text-left mb-3"
            as="h2"
            size="lg"
            p={0}
            noOfLines={1}
          >
            My Account
          </Heading>
          <div className="flex flex-row">
            <img
              src={imageSrc}
              alt="pfp"
              className="mr-6"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="flex flex-col">
              <Heading>{user.fullName}</Heading>
              <div>sell</div>
            </div>
          </div>
          <Divider />
          <Heading>My Listings</Heading>
        </div>
      </div>
    );
  }

  return <div>Not signed in</div>;
}
